import React, { useCallback, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  blocksState,
  chartIndicatorMenuPositionState,
  columnsState,
  isPlayingState,
  mouseDownState,
  noteSizeState,
  notesState,
  zoomState,
} from "../../service/atoms";
import BorderLine from "../BorderLine";
import ChartVertical from "./ChartVertical";
import { Block, Indicator, MouseDown, Note, Zoom } from "../../types/chart";
import { ZOOM_VALUES } from "../../service/zoom";
import { PopoverPosition } from "@mui/material";
import ChartSelector from "./ChartSelector";
import ChartIndicator from "./ChartIndicator";
import ChartIndicatorMenu from "./ChartIndicatorMenu";

function Chart() {
  const [indicator, setIndicator] = useState<Indicator>(null);
  const [mouseDown, setMouseDown] = useRecoilState<MouseDown>(mouseDownState);
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [position, setPosition] = useRecoilState<PopoverPosition | undefined>(
    chartIndicatorMenuPositionState
  );
  const columns = useRecoilValue<5 | 10>(columnsState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 各譜面のブロックを設置するトップバーからのy座標の距離(px単位)を計算
  const blockYDists: number[] = useMemo(
    () =>
      [...Array(blocks.length)].reduce(
        (prev: number[], _, blockIdx: number) =>
          blockIdx === 0
            ? [0]
            : [
                ...prev,
                prev[blockIdx - 1] +
                  (2.0 *
                    noteSize *
                    ZOOM_VALUES[zoom.idx] *
                    blocks[blockIdx - 1].length) /
                    blocks[blockIdx - 1].split,
              ],
        []
      ),
    [blocks, noteSize, zoom.idx]
  );

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize: number = useMemo(
    () => Math.max(Math.floor(noteSize / 20), 1),
    [noteSize]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, column: number) => {
      // ChartIndicatorMenu表示中/再生中の場合はNOP
      if (!!position || isPlaying) return;

      // マウスホバーしたy座標を取得
      const y: number = Math.floor(
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );

      // 譜面のブロックのマウスホバーした際に、マウスの行インデックスの場所にインディケーターを表示
      // 譜面のブロックのマウスホバーが外れた際に、インディケーターを非表示
      let updatedIndicator: Indicator = null;
      for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
        // 譜面のブロックの1行あたりの高さ(px単位)
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / blocks[blockIdx].split;
        // 譜面のブロックの高さ(px単位)
        const blockHeight: number = unitRowHeight * blocks[blockIdx].length;
        if (y < blockYDists[blockIdx] + blockHeight) {
          const top: number = y - ((y - blockYDists[blockIdx]) % unitRowHeight);
          const rowIdx: number =
            blocks[blockIdx].accumulatedLength +
            (top - blockYDists[blockIdx]) / unitRowHeight;
          updatedIndicator = {
            blockAccumulatedLength: blocks[blockIdx].accumulatedLength,
            blockIdx,
            column,
            rowIdx,
            top,
          };
          break;
        }
      }

      // 無駄な再レンダリングを避けるため、マウスホバーした場所の列インデックス・譜面全体での行のインデックスが
      // 現在のインディケーターの列インデックス・譜面全体での行のインデックスとすべて同じである場合、indicatorsの状態を更新しない
      if (
        (indicator !== null || updatedIndicator !== null) &&
        (indicator === null ||
          updatedIndicator === null ||
          indicator.column !== updatedIndicator.column ||
          indicator.rowIdx !== updatedIndicator.rowIdx)
      ) {
        setIndicator(updatedIndicator);
      }
    },
    [
      blockYDists,
      blocks,
      indicator,
      isPlaying,
      noteSize,
      position,
      zoom.idx,
      setIndicator,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    // ChartIndicatorMenu表示中/再生中/の場合はNOP
    if (!!position || isPlaying) return;

    // インディケーターを非表示
    setIndicator(null);
  }, [isPlaying, position, setIndicator]);

  const handleMouseDown = useCallback(() => {
    // ChartIndicatorMenu表示中/再生中の場合はNOP
    if (!!position || isPlaying) return;

    // 押下した瞬間にインディケーターが非表示である場合はNOP
    if (indicator === null) return;

    // マウス押下時のパラメーターを保持
    setMouseDown({
      column: indicator.column,
      rowIdx: indicator.rowIdx,
      top: indicator.top,
    });
  }, [indicator, isPlaying, position, setMouseDown]);

  const handleMouseUp = useCallback(() => {
    // ChartIndicatorMenu表示中/再生中の場合はNOP
    if (!!position || isPlaying) return;

    // 同一列内でのマウス操作の場合のみ、譜面の更新を行う
    if (
      indicator !== null &&
      mouseDown !== null &&
      indicator.column === mouseDown.column
    ) {
      // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
      const start: number = Math.min(indicator.rowIdx, mouseDown.rowIdx);
      const goal: number = Math.max(indicator.rowIdx, mouseDown.rowIdx);

      // 譜面全体での行インデックスmouseDown.rowIdxで押下した後に
      // 譜面全体での行インデックスindicator.rowIdxで押下を離した際の
      // 列インデックスindicator.columnにて、単ノート/ホールドの追加・削除を行う
      let updatedNotes: Note[];
      if (start === goal) {
        // startの場所に単ノートを新規追加
        // ただし、その場所に単ノート/ホールドが含む場合は、それを削除する(単ノートは新規追加しない)
        const foundNote: Note | undefined = notes[indicator.column].find(
          (note: Note) => note.idx === start
        );
        if (foundNote && foundNote.type === "X") {
          updatedNotes = notes[indicator.column].filter(
            (note: Note) => note.idx !== start
          );
        } else if (foundNote && foundNote.type === "M") {
          const goalHoldNote: Note | undefined = notes[indicator.column].find(
            (note: Note) => note.idx > start && note.type === "W"
          );
          updatedNotes = [
            ...notes[indicator.column].filter((note: Note) => note.idx < start),
            ...notes[indicator.column].filter((note: Note) =>
              goalHoldNote ? note.idx > goalHoldNote.idx : false
            ),
          ];
        } else if (foundNote && foundNote.type === "H") {
          const startHoldNote: Note | undefined = [...notes[indicator.column]]
            .reverse()
            .find((note: Note) => note.idx < start && note.type === "M");
          const goalHoldNote: Note | undefined = notes[indicator.column].find(
            (note: Note) => note.idx > start && note.type === "W"
          );
          updatedNotes = [
            ...notes[indicator.column].filter((note: Note) =>
              startHoldNote ? note.idx < startHoldNote.idx : false
            ),
            ...notes[indicator.column].filter((note: Note) =>
              goalHoldNote ? note.idx > goalHoldNote.idx : false
            ),
          ];
        } else if (foundNote && foundNote.type === "W") {
          const startHoldNote: Note | undefined = [...notes[indicator.column]]
            .reverse()
            .find((note: Note) => note.idx < start && note.type === "M");
          updatedNotes = [
            ...notes[indicator.column].filter((note: Note) =>
              startHoldNote ? note.idx < startHoldNote.idx : false
            ),
            ...notes[indicator.column].filter((note: Note) => note.idx > start),
          ];
        } else {
          updatedNotes = [
            ...notes[indicator.column].filter((note: Note) => note.idx < start),
            { idx: start, type: "X" },
            ...notes[indicator.column].filter((note: Note) => note.idx > start),
          ];
        }
      } else {
        // startとgoalとの間にホールドを新規追加
        // ただし、その間の場所に単ノート/ホールドが含む場合は、それをすべて削除してから新規追加する
        updatedNotes = [
          ...notes[indicator.column].filter((note: Note) => note.idx < start),
          ...Array.from<any, Note>(
            { length: goal - start + 1 },
            (_, idx: number) => {
              return {
                idx: start + idx,
                type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
              };
            }
          ),
          ...notes[indicator.column].filter((note: Note) => note.idx > goal),
        ];
      }
      // 単ノート/ホールドの追加・削除を行った譜面に更新
      setMouseDown(null);
      setNotes(
        notes.map((notes: Note[], column: number) =>
          column === indicator.column ? updatedNotes : notes
        )
      );
    }
  }, [
    indicator,
    isPlaying,
    mouseDown,
    notes,
    position,
    setNotes,
    setMouseDown,
  ]);

  const handleSplit = useCallback(
    (indicator: Indicator) => {
      // インディケーターが非表示の場合はNOP
      if (indicator === null) return;

      // blockIdx番目の譜面のブロックを、(rowIdx- 1)番目以前とrowIdx番目とで分割
      setBlocks([
        ...blocks.slice(0, indicator.blockIdx),
        {
          ...blocks[indicator.blockIdx],
          length: indicator.rowIdx - indicator.blockAccumulatedLength,
        },
        {
          ...blocks[indicator.blockIdx],
          accumulatedLength: indicator.rowIdx,
          length:
            blocks[indicator.blockIdx].length +
            indicator.blockAccumulatedLength -
            indicator.rowIdx,
        },
        ...blocks.slice(indicator.blockIdx + 1),
      ]);
    },
    [blocks, setBlocks]
  );

  return (
    <>
      {[...Array(columns)].map((_, column: number) => (
        <React.Fragment key={column}>
          {column === 0 && <BorderLine width={borderSize} height="100%" />}
          <span
            style={{
              width: noteSize,
              display: "flex",
              flexDirection: "column",
            }}
            onContextMenu={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => {
              event.preventDefault();
              setPosition({
                top: event.clientY,
                left: event.clientX,
              });
            }}
            onMouseMove={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => handleMouseMove(event, column)}
            onMouseLeave={() => handleMouseLeave()}
            onMouseDown={() => handleMouseDown()}
            onMouseUp={() => handleMouseUp()}
          >
            <ChartVertical
              blockYDists={blockYDists}
              column={column}
              notes={notes[column]}
            />
          </span>
          <BorderLine width={borderSize} height="100%" />
        </React.Fragment>
      ))}
      <ChartIndicator indicator={indicator} mouseDown={mouseDown} />
      <ChartIndicatorMenu
        handler={{
          split: handleSplit,
        }}
        indicator={indicator}
      />
      <ChartSelector />
    </>
  );
}

export default Chart;
