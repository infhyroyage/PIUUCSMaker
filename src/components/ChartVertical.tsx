import React, { memo, useCallback, useMemo } from "react";
import { ChartVerticalProps } from "../types/props";
import { Block, Chart, Note } from "../types/ucs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  indicatorInfoState,
  isPlayingState,
  isShownSystemErrorSnackbarState,
  menuBarHeightState,
  mouseDownInfoState,
  noteSizeState,
  zoomState,
} from "../service/atoms";
import { ZOOM_VALUES } from "../service/zoom";
import ChartIndicator from "./ChartIndicator";
import { IndicatorInfo, MouseDownInfo, Zoom } from "../types/atoms";
import ChartVerticalNoteImages from "./ChartVerticalNoteImages";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function ChartVertical({ column }: ChartVerticalProps) {
  const [chart, setChart] = useRecoilState<Chart>(chartState);
  const [indicatorInfo, setIndicatorInfo] =
    useRecoilState<IndicatorInfo | null>(indicatorInfoState);
  const [mouseDownInfo, setMouseDownInfo] =
    useRecoilState<MouseDownInfo | null>(mouseDownInfoState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  // 各譜面のブロックの1行あたりの高さをpx単位で計算
  // 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
  // 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
  const unitRowHeights: number[] = useMemo(
    () =>
      chart.blocks.map(
        (block: Block) => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split
      ),
    [chart.blocks, noteSize, zoom.idx]
  );

  // 各譜面のブロックを設置するトップバーからのy座標の距離をpx単位で計算
  const blockYDists: number[] = useMemo(
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
    [chart.blocks, noteSize, zoom.idx]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      // 再生中の場合はNOP
      if (isPlaying) return;

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
        if (y < blockYDists[blockIdx] + blockHeight) {
          const top: number =
            y -
            ((y - blockYDists[blockIdx]) % unitRowHeights[blockIdx]) +
            menuBarHeight;
          const rowIdx: number =
            chart.blocks[blockIdx].accumulatedLength +
            (top - menuBarHeight - blockYDists[blockIdx]) /
              unitRowHeights[blockIdx];
          info = { column, blockIdx, rowIdx, top };
          break;
        }
      }
      setIndicatorInfo(info);
    },
    [
      blockYDists,
      chart.blocks,
      column,
      isPlaying,
      menuBarHeight,
      setIndicatorInfo,
      unitRowHeights,
    ]
  );

  const onMouseLeave = useCallback(() => {
    // 再生中の場合はNOP
    if (isPlaying) return;

    // インディケーターを非表示
    setIndicatorInfo(null);
  }, [isPlaying, setIndicatorInfo]);

  const onMouseDown = useCallback(() => {
    // 再生中、または、押下した瞬間にインディケーターが非表示である場合はNOP
    if (isPlaying || indicatorInfo === null) return;

    // マウス押下時のパラメーターを保持
    setMouseDownInfo({
      column,
      rowIdx: indicatorInfo.rowIdx,
      top: indicatorInfo.top,
    });
  }, [column, indicatorInfo, isPlaying, setMouseDownInfo]);

  const onMouseUp = useCallback(() => {
    // 再生中の場合はNOP
    if (isPlaying) return;

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
        const foundNote: Note | undefined = chart.notes[column].find(
          (note: Note) => note.idx === start
        );
        if (foundNote && foundNote.type === "X") {
          updatedNotes = chart.notes[column].filter(
            (note: Note) => note.idx !== start
          );
        } else if (foundNote && foundNote.type === "M") {
          const goalHoldNote: Note | undefined = chart.notes[column].find(
            (note: Note) => note.idx > start && note.type === "W"
          );
          updatedNotes = [
            ...chart.notes[column].filter((note: Note) => note.idx < start),
            ...chart.notes[column].filter((note: Note) =>
              goalHoldNote ? note.idx > goalHoldNote.idx : false
            ),
          ];
        } else if (foundNote && foundNote.type === "H") {
          const startHoldNote: Note | undefined = [...chart.notes[column]]
            .reverse()
            .find((note: Note) => note.idx < start && note.type === "M");
          const goalHoldNote: Note | undefined = chart.notes[column].find(
            (note: Note) => note.idx > start && note.type === "W"
          );
          updatedNotes = [
            ...chart.notes[column].filter((note: Note) =>
              startHoldNote ? note.idx < startHoldNote.idx : false
            ),
            ...chart.notes[column].filter((note: Note) =>
              goalHoldNote ? note.idx > goalHoldNote.idx : false
            ),
          ];
        } else if (foundNote && foundNote.type === "W") {
          const startHoldNote: Note | undefined = [...chart.notes[column]]
            .reverse()
            .find((note: Note) => note.idx < start && note.type === "M");
          updatedNotes = [
            ...chart.notes[column].filter((note: Note) =>
              startHoldNote ? note.idx < startHoldNote.idx : false
            ),
            ...chart.notes[column].filter((note: Note) => note.idx > start),
          ];
        } else {
          updatedNotes = [
            ...chart.notes[column].filter((note: Note) => note.idx < start),
            { idx: start, type: "X" },
            ...chart.notes[column].filter((note: Note) => note.idx > start),
          ];
        }
      } else {
        // startとgoalとの間にホールドを新規追加
        // ただし、その間の場所に単ノート/ホールドが含む場合は、それをすべて削除してから新規追加する
        updatedNotes = [
          ...chart.notes[column].filter((note: Note) => note.idx < start),
          ...Array.from<any, Note>(
            { length: goal - start + 1 },
            (_, idx: number) => {
              return {
                idx: start + idx,
                type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
              };
            }
          ),
          ...chart.notes[column].filter((note: Note) => note.idx > goal),
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
  }, [chart, column, indicatorInfo, isPlaying, mouseDownInfo, setChart]);

  return (
    <span
      style={{
        width: noteSize,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {[...Array(chart.blocks.length)].map((_, blockIdx: number) => (
        <ChartVerticalRectangles key={blockIdx} blockIdx={blockIdx} />
      ))}
      {chart.notes[column].map((note: Note, i: number) => {
        // noteが属する譜面のブロックのインデックスを取得
        const blockIdx: number = chart.blocks.findIndex(
          (block: Block) => note.idx < block.accumulatedLength + block.length
        );
        // 内部矛盾チェック
        if (blockIdx === -1) {
          setIsShownSystemErrorSnackbar(true);
          return;
        }

        return (
          <ChartVerticalNoteImages
            key={i}
            column={column}
            idx={note.idx}
            type={note.type}
            unitRowHeight={unitRowHeights[blockIdx]}
            y={
              menuBarHeight +
              blockYDists[blockIdx] +
              unitRowHeights[blockIdx] *
                (note.idx - chart.blocks[blockIdx].accumulatedLength)
            }
          />
        );
      })}
      <ChartIndicator column={column} />
    </span>
  );
}

export default memo(ChartVertical);
