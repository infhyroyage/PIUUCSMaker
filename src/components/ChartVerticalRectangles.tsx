import React, { memo, useCallback, useMemo, useState } from "react";
import { ChartVerticalRectanglesProps } from "../types/props";
import { Block, Chart, Note } from "../types/ucs";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  isShownSystemErrorSnackbarState,
  zoomIdxState,
} from "../service/atoms";
import ChartRectangle from "./ChartRectangle";
import ChartBorderLine from "./ChartBorderLine";
import { ZOOM_VALUES } from "../service/zoom";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../service/images";
import useEditNotes from "../hooks/useEditNotes";

const APP_BAR_HEIGHT: number = 64;

function ChartVerticalRectangles({
  borderSize,
  column,
  noteSize,
}: ChartVerticalRectanglesProps) {
  // インディケーターを表示しない場合はnull
  const [indicator, setIndicator] = useState<{
    top: number; // インディケーターのtop値
    blockIdx: number; // インディケーターの示す譜面のブロックのインデックス
    rowIdx: number; // インディケーターの示す譜面全体での行のインデックス
  } | null>(null);
  const [mouseDownRowIdx, setMouseDownRowIdx] = useState<number | null>(null);
  const chart: Chart | null = useRecoilValue<Chart | null>(chartState);
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const theme: Theme = useTheme();

  const { editNotes } = useEditNotes();

  /**
   * 各譜面のブロックにおける、以前までの譜面のブロックまでの行数の総和を計算
   */
  const accumulatedBlockLengths: number[] = useMemo(
    () =>
      chart === null
        ? []
        : [...Array(chart.blocks.length)].reduce(
            (prev: number[], _, blockIdx: number) =>
              blockIdx === 0
                ? [0]
                : [
                    ...prev,
                    prev[blockIdx - 1] + chart.blocks[blockIdx - 1].length,
                  ],
            []
          ),
    [chart]
  );

  /**
   * 各譜面のブロックの1行あたりの高さをpx単位で計算
   * 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
   * 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
   */
  const unitRowHeights: number[] = useMemo(
    () =>
      chart === null
        ? []
        : chart.blocks.map(
            (block: Block) =>
              (2.0 * noteSize * ZOOM_VALUES[zoomIdx]) / block.split
          ),
    [chart, noteSize, zoomIdx]
  );

  /**
   * 各譜面のブロックを設置するトップバーからのy座標の距離をpx単位で計算
   */
  const blockOffsets: number[] = useMemo(
    () =>
      chart === null
        ? []
        : [...Array(chart.blocks.length)].reduce(
            (prev: number[], _, blockIdx: number) =>
              blockIdx === 0
                ? [0]
                : [
                    ...prev,
                    prev[blockIdx - 1] +
                      (2.0 *
                        noteSize *
                        ZOOM_VALUES[zoomIdx] *
                        chart.blocks[blockIdx - 1].length) /
                        chart.blocks[blockIdx - 1].split,
                  ],
            []
          ),
    [chart, noteSize, zoomIdx]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (chart === null) return;

      // マウスホバーしたy座標を取得
      const y: number = Math.floor(
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );

      // 譜面のブロックのマウスホバーした際に、マウスの行インデックスの場所にインディケーターを表示
      // 譜面のブロックのマウスホバーが外れた際に、インディケーターを非表示
      let indicator: {
        top: number;
        blockIdx: number;
        rowIdx: number;
      } | null = null;
      for (let blockIdx = 0; blockIdx < chart.blocks.length; blockIdx++) {
        const blockHeight: number =
          unitRowHeights[blockIdx] * chart.blocks[blockIdx].length;
        if (y < blockOffsets[blockIdx] + blockHeight) {
          const top: number =
            y - (y % unitRowHeights[blockIdx]) + APP_BAR_HEIGHT;
          const rowIdx: number =
            accumulatedBlockLengths[blockIdx] +
            (top - APP_BAR_HEIGHT - blockOffsets[blockIdx]) /
              unitRowHeights[blockIdx];
          indicator = { top, blockIdx, rowIdx };
          break;
        }
      }
      setIndicator(indicator);
    },
    [chart, setIndicator, unitRowHeights]
  );

  const onMouseDown = useCallback(() => {
    // 押下した瞬間にインディケーターが非表示である場合はNOP
    if (indicator === null) return;

    // 押下した譜面全体での行インデックスを保持
    setMouseDownRowIdx(indicator.rowIdx);
  }, [indicator, setMouseDownRowIdx]);

  const onMouseUp = useCallback(() => {
    // 押下を離した瞬間にインディケーターが非表示である/押下した譜面全体での行インデックスが初期値の場合はNOP
    if (indicator === null || mouseDownRowIdx === null) return;

    // 単ノート/ホールドの追加・削除
    editNotes(column, mouseDownRowIdx, indicator.rowIdx);

    // 保持していた押下した譜面全体での行インデックスを初期化
    setMouseDownRowIdx(null);
  }, [indicator, mouseDownRowIdx, setMouseDownRowIdx]);

  return (
    <span
      style={{
        width: `${noteSize}px`,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setIndicator(null)}
    >
      {chart !== null &&
        chart.blocks.map((block: Block, blockIdx: number) =>
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
      {chart !== null &&
        chart.notes[column].map((note: Note, i: number) => {
          // start/goalに対応する譜面のブロックのインデックスをそれぞれ取得
          let startBlockIdx: number | null = null;
          let goalBlockIdx: number | null = null;
          let accumulatedBlockLength: number = 0;
          for (let blockIdx = 0; blockIdx < chart.blocks.length; blockIdx++) {
            if (
              startBlockIdx === null &&
              note.start <
                accumulatedBlockLength + chart.blocks[blockIdx].length
            ) {
              startBlockIdx = blockIdx;
            }
            if (
              goalBlockIdx === null &&
              note.goal < accumulatedBlockLength + chart.blocks[blockIdx].length
            ) {
              goalBlockIdx = blockIdx;
            }

            if (startBlockIdx !== null && goalBlockIdx !== null) break;

            accumulatedBlockLength =
              accumulatedBlockLength + chart.blocks[blockIdx].length;
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
                    APP_BAR_HEIGHT +
                    blockOffsets[startBlockIdx] +
                    unitRowHeights[startBlockIdx] *
                      (note.start - accumulatedBlockLengths[startBlockIdx])
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
                        (note.goal - accumulatedBlockLengths[goalBlockIdx]) -
                      blockOffsets[startBlockIdx] -
                      unitRowHeights[startBlockIdx] *
                        (note.start - accumulatedBlockLengths[startBlockIdx])
                    }
                    style={{
                      position: "absolute",
                      top: `${
                        APP_BAR_HEIGHT +
                        blockOffsets[startBlockIdx] +
                        unitRowHeights[startBlockIdx] *
                          (note.start -
                            accumulatedBlockLengths[startBlockIdx]) +
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
                        APP_BAR_HEIGHT +
                        blockOffsets[goalBlockIdx] +
                        unitRowHeights[goalBlockIdx] *
                          (note.goal - accumulatedBlockLengths[goalBlockIdx])
                      }px`,
                      zIndex: (note.start + 1) * 10 + 1,
                    }}
                  />
                </>
              )}
            </React.Fragment>
          );
        }, [])}
      {indicator !== null && (
        <span
          style={{
            display: "block",
            position: "absolute",
            top: `${indicator.top}px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            zIndex: theme.zIndex.drawer - 1,
          }}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      )}
    </span>
  );
}

export default memo(ChartVerticalRectangles);
