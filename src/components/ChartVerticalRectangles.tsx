import React, { memo, useCallback, useMemo } from "react";
import { ChartVerticalRectanglesProps } from "../types/props";
import { Block, Chart, Note } from "../types/ucs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  indicatorInfoState,
  isShownSystemErrorSnackbarState,
  menuBarHeightState,
  mouseDownInfoState,
  zoomState,
} from "../service/atoms";
import ChartRectangle from "./ChartRectangle";
import ChartBorderLine from "./ChartBorderLine";
import { ZOOM_VALUES } from "../service/zoom";
import { IMAGE_BINARIES } from "../service/assets";
import ChartIndicator from "./ChartIndicator";
import { IndicatorInfo, MouseDownInfo, Zoom } from "../types/atoms";
import useChartSizes from "../hooks/useChartSizes";

function ChartVerticalRectangles({ column }: ChartVerticalRectanglesProps) {
  const [chart, setChart] = useRecoilState<Chart>(chartState);
  const [indicatorInfo, setIndicatorInfo] =
    useRecoilState<IndicatorInfo | null>(indicatorInfoState);
  const [mouseDownInfo, setMouseDownInfo] =
    useRecoilState<MouseDownInfo | null>(mouseDownInfoState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  // 単ノートの1辺、枠線のサイズを取得
  const { noteSize, borderSize } = useChartSizes();

  /**
   * 各譜面のブロックの1行あたりの高さをpx単位で計算
   * 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
   * 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
   */
  const unitRowHeights: number[] = useMemo(
    () =>
      chart.blocks.map(
        (block: Block) => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split
      ),
    [chart.blocks, noteSize, zoom]
  );

  /**
   * 各譜面のブロックを設置するトップバーからのy座標の距離をpx単位で計算
   */
  const blockOffsets: number[] = useMemo(
    () =>
      [...Array(chart.blocks.length)].reduce(
        (prev: number[], _, blockIdx: number) =>
          blockIdx === 0
            ? [0]
            : [
                ...prev,
                prev[blockIdx - 1] +
                  (2.0 *
                    noteSize *
                    ZOOM_VALUES[zoom.idx] *
                    chart.blocks[blockIdx - 1].length) /
                    chart.blocks[blockIdx - 1].split,
              ],
        []
      ),
    [chart.blocks, noteSize, zoom]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      // マウスホバーしたy座標を取得
      const y: number = Math.floor(
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );

      // 譜面のブロックのマウスホバーした際に、マウスの行インデックスの場所にインディケーターを表示
      // 譜面のブロックのマウスホバーが外れた際に、インディケーターを非表示
      let info: IndicatorInfo | null = null;
      for (let blockIdx = 0; blockIdx < chart.blocks.length; blockIdx++) {
        const blockHeight: number =
          unitRowHeights[blockIdx] * chart.blocks[blockIdx].length;
        if (y < blockOffsets[blockIdx] + blockHeight) {
          const top: number =
            y - (y % unitRowHeights[blockIdx]) + menuBarHeight;
          const rowIdx: number =
            chart.blocks[blockIdx].accumulatedLength +
            (top - menuBarHeight - blockOffsets[blockIdx]) /
              unitRowHeights[blockIdx];
          info = { column, blockIdx, rowIdx, top };
          break;
        }
      }
      setIndicatorInfo(info);
    },
    [
      blockOffsets,
      chart.blocks,
      column,
      menuBarHeight,
      setIndicatorInfo,
      unitRowHeights,
    ]
  );

  const onMouseDown = useCallback(() => {
    // 押下した瞬間にインディケーターが非表示である場合はNOP
    if (indicatorInfo === null) return;

    // マウス押下時のパラメーターを保持
    setMouseDownInfo({
      column,
      rowIdx: indicatorInfo.rowIdx,
      top: indicatorInfo.top,
    });
  }, [column, indicatorInfo, setMouseDownInfo]);

  const onMouseUp = useCallback(() => {
    // 同一列内でのマウス操作の場合のみ、譜面の更新を行う
    if (
      mouseDownInfo !== null &&
      column === mouseDownInfo.column &&
      indicatorInfo !== null
    ) {
      // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
      const start: number =
        mouseDownInfo.rowIdx < indicatorInfo.rowIdx
          ? mouseDownInfo.rowIdx
          : indicatorInfo.rowIdx;
      const goal: number =
        mouseDownInfo.rowIdx < indicatorInfo.rowIdx
          ? indicatorInfo.rowIdx
          : mouseDownInfo.rowIdx;

      // 譜面全体での行インデックスmouseDownInfo.rowIdxで押下した後に
      // 譜面全体での行インデックスindicatorInfo.rowIdxで押下を離した際の
      // 列インデックスcolumnにて、単ノート/ホールドの追加・削除を行う
      let updatedNotes: Note[];
      if (start === goal) {
        // startの場所に単ノートを新規追加
        // ただし、その場所に単ノート/ホールドが含む場合は、それを削除する(単ノートは新規追加しない)
        const noteIdx: number = chart.notes[column].findIndex(
          (note: Note) => note.start <= start && start <= note.goal
        );
        updatedNotes =
          noteIdx === -1
            ? [...chart.notes[column], { start, goal }]
            : [
                ...chart.notes[column].slice(0, noteIdx),
                ...chart.notes[column].slice(noteIdx + 1),
              ];
      } else {
        // startとgoalとの間にホールドを新規追加
        // ただし、その間の場所に単ノート/ホールドが含む場合は、それをすべて削除してから新規追加する
        updatedNotes = [
          ...chart.notes[column].filter(
            (note: Note) => note.start > goal || note.goal < start
          ),
          { start, goal },
        ];
      }
      // 単ノート/ホールドの追加・削除を行った譜面に更新
      setChart({
        ...chart,
        notes: chart.notes.map((notes: Note[], i: number) =>
          i === column ? updatedNotes : notes
        ),
      });
    }
  }, [chart, column, indicatorInfo, mouseDownInfo, setChart]);

  return (
    <span
      style={{
        width: `${noteSize}px`,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setIndicatorInfo(null)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {chart.blocks.map((block: Block, blockIdx: number) =>
        blockIdx === chart.blocks.length - 1 ? (
          <ChartRectangle
            key={blockIdx}
            blockIdx={blockIdx}
            height={unitRowHeights[blockIdx] * block.length}
          />
        ) : (
          // 譜面のブロックの下部に境界線を設置
          <React.Fragment key={blockIdx}>
            <ChartRectangle
              blockIdx={blockIdx}
              height={unitRowHeights[blockIdx] * block.length - borderSize}
            />
            <ChartBorderLine
              width={`${noteSize}px`}
              height={`${borderSize}px`}
            />
          </React.Fragment>
        )
      )}
      {chart.notes[column].map((note: Note, i: number) => {
        // start/goalに対応する譜面のブロックのインデックスをそれぞれ取得
        let startBlockIdx: number | null = null;
        let goalBlockIdx: number | null = null;
        let accumulatedLengthTemp: number = 0;
        for (let blockIdx = 0; blockIdx < chart.blocks.length; blockIdx++) {
          if (
            startBlockIdx === null &&
            note.start < accumulatedLengthTemp + chart.blocks[blockIdx].length
          ) {
            startBlockIdx = blockIdx;
          }
          if (
            goalBlockIdx === null &&
            note.goal < accumulatedLengthTemp + chart.blocks[blockIdx].length
          ) {
            goalBlockIdx = blockIdx;
          }

          if (startBlockIdx !== null && goalBlockIdx !== null) break;

          accumulatedLengthTemp += chart.blocks[blockIdx].length;
        }

        // 内部矛盾チェック
        if (startBlockIdx === null || goalBlockIdx === null) {
          setIsShownSystemErrorSnackbar(true);
          return;
        }

        return (
          <React.Fragment key={i}>
            {/* 単ノート/ホールドの始点の画像 */}
            <img
              src={IMAGE_BINARIES[column % 5].note}
              alt={`note${column % 5}`}
              width={noteSize}
              height={noteSize}
              style={{
                position: "absolute",
                top: `${
                  menuBarHeight +
                  blockOffsets[startBlockIdx] +
                  unitRowHeights[startBlockIdx] *
                    (note.start - chart.blocks[startBlockIdx].accumulatedLength)
                }px`,
                zIndex: (note.start + 1) * 10,
              }}
            />
            {note.start !== note.goal && (
              <>
                {/* ホールドの画像 */}
                <img
                  src={IMAGE_BINARIES[column % 5].hold}
                  alt={`hold${column % 5}`}
                  width={noteSize}
                  height={
                    blockOffsets[goalBlockIdx] +
                    unitRowHeights[goalBlockIdx] *
                      (note.goal -
                        chart.blocks[goalBlockIdx].accumulatedLength) -
                    blockOffsets[startBlockIdx] -
                    unitRowHeights[startBlockIdx] *
                      (note.start -
                        chart.blocks[startBlockIdx].accumulatedLength)
                  }
                  style={{
                    position: "absolute",
                    top: `${
                      menuBarHeight +
                      blockOffsets[startBlockIdx] +
                      unitRowHeights[startBlockIdx] *
                        (note.start -
                          chart.blocks[startBlockIdx].accumulatedLength) +
                      noteSize * 0.5
                    }px`,
                    zIndex: (note.start + 1) * 10 + 2,
                  }}
                />
                {/* ホールドの終点の画像 */}
                <img
                  src={IMAGE_BINARIES[column % 5].note}
                  alt={`note${column % 5}`}
                  width={noteSize}
                  height={noteSize}
                  style={{
                    position: "absolute",
                    top: `${
                      menuBarHeight +
                      blockOffsets[goalBlockIdx] +
                      unitRowHeights[goalBlockIdx] *
                        (note.goal -
                          chart.blocks[goalBlockIdx].accumulatedLength)
                    }px`,
                    zIndex: (note.start + 1) * 10 + 1,
                  }}
                />
              </>
            )}
          </React.Fragment>
        );
      }, [])}
      <ChartIndicator column={column} />
    </span>
  );
}

export default memo(ChartVerticalRectangles);
