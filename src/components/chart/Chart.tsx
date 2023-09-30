import React, { useCallback, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  blocksState,
  chartIndicatorMenuPositionState,
  columnsState,
  isPlayingState,
  noteSizeState,
  notesState,
  selectorState,
  zoomState,
} from "../../service/atoms";
import BorderLine from "../BorderLine";
import ChartVertical from "./ChartVertical";
import { Block, Indicator, Note, Selector, Zoom } from "../../types/chart";
import { ZOOM_VALUES } from "../../service/zoom";
import { PopoverPosition } from "@mui/material";
import ChartIndicator from "./ChartIndicator";
import ChartIndicatorMenu from "./ChartIndicatorMenu";
import ChartSelector from "./ChartSelector";

function Chart() {
  const [indicator, setIndicator] = useState<Indicator>(null);
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [position, setPosition] = useRecoilState<PopoverPosition | undefined>(
    chartIndicatorMenuPositionState
  );
  const [selector, setSelector] = useRecoilState<Selector>(selectorState);
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

  // 縦の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  const handleMouseMove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    column: number
  ) => {
    // ChartIndicatorMenu表示中/再生中の場合はNOP
    if (!!position || isPlaying) return;

    // マウスホバーしたy座標を取得
    const y: number = Math.floor(
      event.clientY - event.currentTarget.getBoundingClientRect().top
    );

    // 譜面のブロックのマウスホバーした行インデックスの場所での、マウスのブラウザの画面のy座標、行インデックスを取得
    // 譜面のブロックのマウスホバーが外れた場合、ともにnullとする
    let top: number | null = null;
    let rowIdx: number | null = null;
    let blockIdx = 0;
    for (; blockIdx < blocks.length; blockIdx++) {
      // 譜面のブロックの1行あたりの高さ(px単位)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / blocks[blockIdx].split;
      // 譜面のブロックの高さ(px単位)
      const blockHeight: number = unitRowHeight * blocks[blockIdx].length;
      if (y < blockYDists[blockIdx] + blockHeight) {
        top = y - ((y - blockYDists[blockIdx]) % unitRowHeight);
        rowIdx =
          blocks[blockIdx].accumulatedLength +
          (top - blockYDists[blockIdx]) / unitRowHeight;
        break;
      }
    }

    // 無駄な再レンダリングを避けるため、マウスホバーした場所の列インデックス・譜面全体での行のインデックスが
    // 現在のインディケーターの列インデックス・譜面全体での行のインデックスとすべて同じである場合、indicatorの状態を更新しない
    if (
      (indicator !== null || (top !== null && rowIdx !== null)) &&
      (indicator === null ||
        top === null ||
        rowIdx === null ||
        indicator.column !== column ||
        indicator.rowIdx !== rowIdx)
    ) {
      setIndicator(
        top !== null && rowIdx !== null
          ? {
              blockAccumulatedLength: blocks[blockIdx].accumulatedLength,
              blockIdx,
              column,
              mouseDownColumn:
                indicator === null ? null : indicator.mouseDownColumn,
              mouseDownRowIdx:
                indicator === null ? null : indicator.mouseDownRowIdx,
              mouseDownTop: indicator === null ? null : indicator.mouseDownTop,
              rowIdx,
              top,
            }
          : null
      );
    }

    if (
      event.shiftKey &&
      selector.changingCords !== null &&
      (column !== selector.changingCords.mouseUpColumn ||
        rowIdx !== selector.changingCords.mouseUpRowIdx)
    ) {
      // 選択領域入力時の場合は選択領域を更新
      setSelector({
        changingCords: {
          ...selector.changingCords,
          mouseUpColumn: column,
          mouseUpRowIdx: rowIdx,
        },
        completedCords: null,
      });
    } else if (!event.shiftKey && selector.changingCords !== null) {
      // Shift未入力、かつ、選択領域入力時は選択領域のパラメーターを非表示
      setSelector({ changingCords: null, completedCords: null });
    }
  };

  const onMouseLeave = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // ChartIndicatorMenu表示中/再生中/の場合はNOP
    if (!!position || isPlaying) return;

    // インディケーターを非表示
    setIndicator(null);

    if (event.shiftKey && selector.changingCords !== null) {
      // 選択領域入力時の場合は選択領域を非表示
      setSelector({
        changingCords: {
          ...selector.changingCords,
          mouseUpColumn: null,
          mouseUpRowIdx: null,
        },
        completedCords: null,
      });
    } else if (!event.shiftKey && selector.changingCords !== null) {
      // Shift未入力、かつ、選択領域入力時は選択領域のパラメーターを非表示
      setSelector({ changingCords: null, completedCords: null });
    }
  };

  const onMouseDown = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // 左クリック以外/ChartIndicatorMenu表示中/再生中/押下した瞬間にインディケーターが非表示の場合はNOP
    if (event.button !== 0 || !!position || isPlaying || indicator === null)
      return;

    // Shift未入力の場合のみ、マウス押下時のパラメーターを保持
    if (!event.shiftKey) {
      setIndicator({
        ...indicator,
        mouseDownColumn: indicator.column,
        mouseDownRowIdx: indicator.rowIdx,
        mouseDownTop: indicator.top,
      });
    }

    if (event.shiftKey) {
      // Shift入力時の場合は、選択領域入力時のみパラメーターを設定
      setSelector({
        changingCords: {
          mouseDownColumn: indicator.column,
          mouseDownRowIdx: indicator.rowIdx,
          mouseUpColumn: indicator.column,
          mouseUpRowIdx: indicator.rowIdx,
        },
        completedCords: null,
      });
    } else if (
      selector.changingCords !== null ||
      selector.completedCords !== null
    ) {
      // Shift未入力、かつ、選択領域表示時は選択領域を非表示
      setSelector({ changingCords: null, completedCords: null });
    }
  };

  const onMouseUp = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // 左クリック以外/ChartIndicatorMenu表示中/再生中/別々の列を跨いだマウス操作の場合はNOP
    if (event.button !== 0 || !!position || isPlaying) return;

    // 親コンポーネントのWorkspaceに設定したonMouseUpへ伝搬しない
    event.stopPropagation();

    // 同一列内でのクリック操作時は譜面の更新を行う
    if (
      indicator !== null &&
      indicator.mouseDownColumn !== null &&
      indicator.mouseDownRowIdx !== null &&
      indicator.column === indicator.mouseDownColumn
    ) {
      // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
      const start: number = Math.min(
        indicator.rowIdx,
        indicator.mouseDownRowIdx
      );
      const goal: number = Math.max(
        indicator.rowIdx,
        indicator.mouseDownRowIdx
      );

      // 譜面全体での行インデックスindicator.mouseDownRowIdxで押下した後に
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
        // ただし、新規追加するホールドの間に単ノート/ホールド(M/H/W)が含む場合は、事前にすべて削除しておく
        let beforeNotes: Note[] = notes[indicator.column].filter(
          (note: Note) => note.idx < start
        );
        for (const beforeNote of beforeNotes.reverse()) {
          if (["X", "W"].includes(beforeNote.type)) {
            break;
          } else if (beforeNote.type === "M") {
            beforeNotes = beforeNotes.filter(
              (note: Note) => note.idx < beforeNote.idx
            );
            break;
          }
        }

        const hold: Note[] = Array.from<any, Note>(
          { length: goal - start + 1 },
          (_, idx: number) => {
            return {
              idx: start + idx,
              type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
            };
          }
        );

        let afterNotes: Note[] = notes[indicator.column].filter(
          (note: Note) => note.idx > goal
        );
        for (const afterNote of afterNotes) {
          if (["X", "M"].includes(afterNote.type)) {
            break;
          } else if (afterNote.type === "W") {
            afterNotes = afterNotes.filter(
              (note: Note) => note.idx > afterNote.idx
            );
            break;
          }
        }

        updatedNotes = [...beforeNotes, ...hold, ...afterNotes];
      }

      // 単ノート/ホールドの追加・削除を行った譜面に更新
      setNotes(
        notes.map((notes: Note[], column: number) =>
          column === indicator.column ? updatedNotes : notes
        )
      );
    }

    // マウス押下時のパラメーターを初期化
    if (
      indicator !== null &&
      (indicator.mouseDownColumn !== null ||
        indicator.mouseDownRowIdx !== null ||
        indicator.mouseDownTop !== null)
    ) {
      setIndicator({
        ...indicator,
        mouseDownColumn: null,
        mouseDownRowIdx: null,
        mouseDownTop: null,
      });
    }

    if (selector.changingCords !== null) {
      // 選択領域入力時の場合は選択領域を入力時→入力後に更新
      setSelector({
        changingCords: null,
        completedCords: { ...selector.changingCords },
      });
    }
  };

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
      setIndicator({
        ...indicator,
        blockIdx: indicator.blockIdx + 1,
        blockAccumulatedLength: indicator.rowIdx,
      });
    },
    [blocks, indicator, setBlocks, setIndicator]
  );

  return (
    <>
      {[...Array(columns)].map((_, column: number) => (
        <React.Fragment key={column}>
          {column === 0 && (
            <BorderLine
              style={{ height: "100%", width: verticalBorderSize * 0.5 }}
            />
          )}
          <div
            style={{ display: "flex" }}
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
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <BorderLine
              style={{ height: "100%", width: verticalBorderSize * 0.5 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: noteSize - verticalBorderSize,
              }}
            >
              <ChartVertical
                blockYDists={blockYDists}
                column={column}
                notes={notes[column]}
              />
            </div>
            <BorderLine
              style={{ height: "100%", width: verticalBorderSize * 0.5 }}
            />
          </div>
          {column === columns - 1 && (
            <BorderLine
              style={{ height: "100%", width: verticalBorderSize * 0.5 }}
            />
          )}
        </React.Fragment>
      ))}
      <ChartIndicator indicator={indicator} />
      <ChartIndicatorMenu
        handler={{
          split: handleSplit,
        }}
        indicator={indicator}
      />
      {selector.changingCords !== null && (
        <ChartSelector cords={selector.changingCords} />
      )}
      {selector.completedCords !== null && (
        <ChartSelector cords={selector.completedCords} />
      )}
    </>
  );
}

export default Chart;
