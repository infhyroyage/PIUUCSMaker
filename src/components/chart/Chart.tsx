import React, { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  blocksState,
  chartIndicatorMenuPositionState,
  columnsState,
  indicatorsState,
  isPlayingState,
  mouseDownsState,
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

function Chart() {
  const [indicators, setIndicators] =
    useRecoilState<Indicator[]>(indicatorsState);
  const [mouseDowns, setMouseDowns] =
    useRecoilState<MouseDown[]>(mouseDownsState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const position = useRecoilValue<PopoverPosition | undefined>(
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
            rowIdx,
            top,
          };
          break;
        }
      }

      // 無駄な再レンダリングを避けるため、マウスホバーした場所の譜面全体での行のインデックスが
      // 現在のインディケーターの譜面全体での行のインデックスと同じ場合は、indicatorsの状態を更新しない
      const indicator: Indicator = indicators[column];
      if (
        (indicator !== null || updatedIndicator !== null) &&
        (indicator === null ||
          updatedIndicator === null ||
          indicator.rowIdx !== updatedIndicator.rowIdx)
      ) {
        const updatedIndicators: Indicator[] = new Array<Indicator>(10).fill(
          null
        );
        updatedIndicators[column] = updatedIndicator;
        setIndicators(updatedIndicators);
      }
    },
    [
      blockYDists,
      blocks,
      indicators,
      isPlaying,
      noteSize,
      position,
      zoom.idx,
      setIndicators,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    // ChartIndicatorMenu表示中/再生中の場合はNOP
    if (!!position || isPlaying) return;

    // インディケーターを非表示
    setIndicators(new Array<Indicator>(10).fill(null));
  }, [isPlaying, position, setIndicators]);

  const handleMouseDown = useCallback(
    (column: number) => {
      // ChartIndicatorMenu表示中/再生中の場合はNOP
      if (!!position || isPlaying) return;

      // 押下した瞬間にインディケーターが非表示である場合はNOP
      const indicator: Indicator = indicators[column];
      if (indicator === null) return;

      // マウス押下時のパラメーターを保持
      const updatedMouseDowns: MouseDown[] = new Array<MouseDown>(10).fill(
        null
      );
      updatedMouseDowns[column] = {
        rowIdx: indicator.rowIdx,
        top: indicator.top,
      };
      setMouseDowns(updatedMouseDowns);
    },
    [indicators, isPlaying, position, setMouseDowns]
  );

  const handleMouseUp = useCallback(
    (column: number) => {
      // ChartIndicatorMenu表示中/再生中の場合はNOP
      if (!!position || isPlaying) return;

      // 同一列内でのマウス操作の場合のみ、譜面の更新を行う
      const indicator: Indicator = indicators[column];
      const mouseDown: MouseDown = mouseDowns[column];
      if (indicator !== null && mouseDown !== null) {
        // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
        const start: number = Math.min(indicator.rowIdx, mouseDown.rowIdx);
        const goal: number = Math.max(indicator.rowIdx, mouseDown.rowIdx);

        // 譜面全体での行インデックスmouseDown.rowIdxで押下した後に
        // 譜面全体での行インデックスindicator.rowIdxで押下を離した際の
        // 列インデックスcolumnにて、単ノート/ホールドの追加・削除を行う
        let updatedNotes: Note[];
        if (start === goal) {
          // startの場所に単ノートを新規追加
          // ただし、その場所に単ノート/ホールドが含む場合は、それを削除する(単ノートは新規追加しない)
          const foundNote: Note | undefined = notes[column].find(
            (note: Note) => note.idx === start
          );
          if (foundNote && foundNote.type === "X") {
            updatedNotes = notes[column].filter(
              (note: Note) => note.idx !== start
            );
          } else if (foundNote && foundNote.type === "M") {
            const goalHoldNote: Note | undefined = notes[column].find(
              (note: Note) => note.idx > start && note.type === "W"
            );
            updatedNotes = [
              ...notes[column].filter((note: Note) => note.idx < start),
              ...notes[column].filter((note: Note) =>
                goalHoldNote ? note.idx > goalHoldNote.idx : false
              ),
            ];
          } else if (foundNote && foundNote.type === "H") {
            const startHoldNote: Note | undefined = [...notes[column]]
              .reverse()
              .find((note: Note) => note.idx < start && note.type === "M");
            const goalHoldNote: Note | undefined = notes[column].find(
              (note: Note) => note.idx > start && note.type === "W"
            );
            updatedNotes = [
              ...notes[column].filter((note: Note) =>
                startHoldNote ? note.idx < startHoldNote.idx : false
              ),
              ...notes[column].filter((note: Note) =>
                goalHoldNote ? note.idx > goalHoldNote.idx : false
              ),
            ];
          } else if (foundNote && foundNote.type === "W") {
            const startHoldNote: Note | undefined = [...notes[column]]
              .reverse()
              .find((note: Note) => note.idx < start && note.type === "M");
            updatedNotes = [
              ...notes[column].filter((note: Note) =>
                startHoldNote ? note.idx < startHoldNote.idx : false
              ),
              ...notes[column].filter((note: Note) => note.idx > start),
            ];
          } else {
            updatedNotes = [
              ...notes[column].filter((note: Note) => note.idx < start),
              { idx: start, type: "X" },
              ...notes[column].filter((note: Note) => note.idx > start),
            ];
          }
        } else {
          // startとgoalとの間にホールドを新規追加
          // ただし、その間の場所に単ノート/ホールドが含む場合は、それをすべて削除してから新規追加する
          updatedNotes = [
            ...notes[column].filter((note: Note) => note.idx < start),
            ...Array.from<any, Note>(
              { length: goal - start + 1 },
              (_, idx: number) => {
                return {
                  idx: start + idx,
                  type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
                };
              }
            ),
            ...notes[column].filter((note: Note) => note.idx > goal),
          ];
        }
        // 単ノート/ホールドの追加・削除を行った譜面に更新
        setMouseDowns(new Array<MouseDown>(10).fill(null));
        setNotes(
          notes.map((notes: Note[], i: number) =>
            i === column ? updatedNotes : notes
          )
        );
      }
    },
    [
      indicators,
      isPlaying,
      mouseDowns,
      notes,
      position,
      setNotes,
      setMouseDowns,
    ]
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
            onMouseMove={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => handleMouseMove(event, column)}
            onMouseLeave={() => handleMouseLeave()}
            onMouseDown={() => handleMouseDown(column)}
            onMouseUp={() => handleMouseUp(column)}
          >
            <ChartVertical
              blockYDists={blockYDists}
              column={column}
              indicator={indicators[column]}
              mouseDown={mouseDowns[column]}
              notes={notes[column]}
            />
          </span>
          <BorderLine width={borderSize} height="100%" />
        </React.Fragment>
      ))}
      <ChartSelector />
    </>
  );
}

export default Chart;
