import React, { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  chartIndicatorMenuPositionState,
  indicatorState,
  isPlayingState,
  isProtectedState,
  holdSetterState,
  noteSizeState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
  zoomState,
} from "../../services/atoms";
import BorderLine from "./BorderLine";
import ChartVertical from "./ChartVertical";
import { Block, Note } from "../../types/ucs";
import { HoldSetter } from "../../types/chart";
import { ChartIndicatorMenuPosition, Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import { Selector } from "../../types/chart";
import { Indicator } from "../../types/chart";
import { ZOOM_VALUES } from "../../services/assets";
import ChartIndicator from "./ChartIndicator";
import ChartIndicatorMenu from "../menu/ChartIndicatorMenu";
import ChartSelector from "./ChartSelector";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";

function Chart() {
  const [indicator, setIndicator] = useRecoilState<Indicator>(indicatorState);
  const [holdSetter, setHoldSetter] =
    useRecoilState<HoldSetter>(holdSetterState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [position, setPosition] = useRecoilState<ChartIndicatorMenuPosition>(
    chartIndicatorMenuPositionState
  );
  const [selector, setSelector] = useRecoilState<Selector>(selectorState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const verticalBorderSize = useVerticalBorderSize();

  // 各譜面のブロックを設置するトップバーからのy座標の距離(px)を計算
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
                    blocks[blockIdx - 1].rows) /
                    blocks[blockIdx - 1].split,
              ],
        []
      ),
    [blocks, noteSize, zoom.idx]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, column: number) => {
      // ChartIndicatorMenu表示中/再生中の場合はNOP
      if (!!position || isPlaying) return;

      // マウスホバーしたy座標を取得
      const y: number = Math.floor(
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );

      // マウスホバーした譜面全体の行インデックスの場所から、マウスのブラウザの画面のy座標、
      // 行インデックス、譜面のブロックのインデックスをすべて取得
      // 譜面のブロックのマウスホバーが外れた場合、前者2つはともにnullとする
      let top: number | null = null;
      let rowIdx: number | null = null;
      const blockIdx: number = blocks.findIndex((block: Block, idx: number) => {
        // 譜面のブロックの1行あたりの高さ(px)
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;
        // 譜面のブロックの高さ(px)
        const blockHeight: number = unitRowHeight * block.rows;
        if (y < blockYDists[idx] + blockHeight) {
          top = y - ((y - blockYDists[idx]) % unitRowHeight);
          // (top - blockYDists[idx])はunitRowHeightの倍数であるため、((top - blockYDists[idx]) / unitRowHeight)は理論上整数値となるが、
          // 除算時の丸め誤差を取り除くべくMath.round関数を実行することで、整数値として計算することを必ず保証する
          rowIdx =
            block.accumulatedRows +
            Math.round((top - blockYDists[idx]) / unitRowHeight);
          return true;
        }
        return false;
      });

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
                blockAccumulatedRows: blocks[blockIdx].accumulatedRows,
                blockIdx,
                column,
                rowIdx,
                top,
              }
            : null
        );
      }

      if (
        selector.setting !== null &&
        (column !== selector.setting.mouseUpColumn ||
          rowIdx !== selector.setting.mouseUpRowIdx)
      ) {
        // 選択領域入力時の場合は、入力時の選択領域のみパラメーターを更新
        setSelector({
          completed: null,
          isSettingByMenu: selector.isSettingByMenu,
          setting: {
            ...selector.setting,
            mouseUpColumn: column,
            mouseUpRowIdx: rowIdx,
          },
        });
      } else if (
        !event.shiftKey &&
        selector.setting !== null &&
        !selector.isSettingByMenu
      ) {
        // Shift未入力、かつ、「Start Selecting」を選択せずに入力時の選択領域を表示している場合は、選択領域を非表示
        setSelector({ setting: null, completed: null, isSettingByMenu: false });
      }
    },
    [
      blocks,
      blockYDists,
      indicator,
      isPlaying,
      noteSize,
      position,
      selector.setting,
      selector.isSettingByMenu,
      setIndicator,
      setSelector,
      zoom.idx,
    ]
  );

  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // ChartIndicatorMenu表示中/再生中/の場合はNOP
      if (!!position || isPlaying) return;

      // インディケーターを非表示
      setIndicator(null);

      // 選択領域入力時の場合は、入力時の選択領域のみパラメーターを更新
      // ただし、Shift未入力、かつ、「Start Selecting」を選択せずに入力時の選択領域を表示している場合は、選択領域を非表示
      if (selector.setting !== null) {
        setSelector({
          completed: null,
          isSettingByMenu:
            !event.shiftKey && !selector.isSettingByMenu
              ? false
              : selector.isSettingByMenu,
          setting:
            !event.shiftKey && !selector.isSettingByMenu
              ? null
              : {
                  ...selector.setting,
                  mouseUpColumn: null,
                  mouseUpRowIdx: null,
                },
        });
      }
    },
    [
      isPlaying,
      position,
      selector.setting,
      selector.isSettingByMenu,
      setIndicator,
      setSelector,
    ]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック以外/ChartIndicatorMenu表示中/再生中/押下した瞬間にインディケーターが非表示の場合はNOP
      if (event.button !== 0 || !!position || isPlaying || indicator === null)
        return;

      // Shift未入力の場合のみ、ホールド設置中の表示パラメーターを更新
      if (!event.shiftKey && holdSetter === null) {
        setHoldSetter({
          column: indicator.column,
          isSettingByMenu: false,
          rowIdx: indicator.rowIdx,
          top: indicator.top,
        });
      }

      if (event.shiftKey && selector.setting === null) {
        // Shift入力時、かつ、選択領域入力時ではない場合は、入力時の選択領域のみパラメーターを設定
        setSelector({
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: indicator.column,
            mouseDownRowIdx: indicator.rowIdx,
            mouseUpColumn: indicator.column,
            mouseUpRowIdx: indicator.rowIdx,
          },
        });
      } else if (
        !event.shiftKey &&
        ((selector.setting !== null && !selector.isSettingByMenu) ||
          selector.completed !== null)
      ) {
        // Shift未入力、かつ、「Start Selecting」を選択せずに選択領域を表示している場合は、選択領域を非表示
        setSelector({ completed: null, isSettingByMenu: false, setting: null });
      }
    },
    [
      holdSetter,
      indicator,
      isPlaying,
      position,
      selector,
      setHoldSetter,
      setSelector,
    ]
  );

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック以外/ChartIndicatorMenu表示中/再生中/別々の列を跨いだマウス操作の場合はNOP
      if (event.button !== 0 || !!position || isPlaying) return;

      // 親コンポーネントのWorkspaceに設定したonMouseUpへ伝搬しない
      event.stopPropagation();

      // 同一列内でのクリック操作時、かつ、選択領域入力時でない場合のみ、単ノート/ホールドの設置・削除を行う
      if (
        indicator !== null &&
        holdSetter !== null &&
        indicator.column === holdSetter.column &&
        selector.setting === null
      ) {
        // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
        const start: number = Math.min(indicator.rowIdx, holdSetter.rowIdx);
        const goal: number = Math.max(indicator.rowIdx, holdSetter.rowIdx);

        // 譜面全体での行インデックスmouseDown.rowIdxで押下した後に
        // 譜面全体での行インデックスindicator.rowIdxで押下を離した際の
        // 列インデックスindicator.columnにて、単ノート/ホールドの追加・削除を行う
        let updatedNotes: Note[];
        if (start === goal) {
          const foundNote: Note | undefined = notes[indicator.column].find(
            (note: Note) => note.rowIdx === start
          );
          if (foundNote && foundNote.type === "X") {
            // startの場所に存在する単ノートを削除(単ノートは新規追加しない)
            updatedNotes = notes[indicator.column].filter(
              (note: Note) => note.rowIdx !== start
            );
          } else if (foundNote) {
            // startの場所に属するホールド(M/H/W)を削除(単ノートは新規追加しない)
            let beforeNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            );
            const foundBeforeNote: Note | undefined = [...beforeNotes]
              .reverse()
              .find((note: Note) => ["X", "M", "W"].includes(note.type));
            if (foundBeforeNote) {
              beforeNotes = beforeNotes.filter((note: Note) =>
                foundBeforeNote.type === "M"
                  ? note.rowIdx < foundBeforeNote.rowIdx
                  : note.rowIdx <= foundBeforeNote.rowIdx
              );
            }

            let afterNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx > start
            );
            const foundAfterNote: Note | undefined = afterNotes.find(
              (note: Note) => ["X", "M", "W"].includes(note.type)
            );
            if (foundAfterNote) {
              afterNotes = afterNotes.filter((note: Note) =>
                foundAfterNote.type === "W"
                  ? note.rowIdx > foundAfterNote.rowIdx
                  : note.rowIdx >= foundAfterNote.rowIdx
              );
            }

            updatedNotes = [...beforeNotes, ...afterNotes];
          } else {
            // startの場所に単ノートを新規追加
            updatedNotes = [
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx < start
              ),
              { rowIdx: start, type: "X" },
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx > start
              ),
            ];
          }
        } else {
          const hold: Note[] = Array.from<unknown, Note>(
            { length: goal - start + 1 },
            (_, idx: number) => {
              return {
                rowIdx: start + idx,
                type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
              };
            }
          );

          if (
            notes[indicator.column].filter(
              (note: Note) => note.rowIdx >= start && note.rowIdx <= goal
            ).length > 0
          ) {
            // startとgoalとの間に属するホールド(M/H/W)を削除してから
            // startとgoalとの間にホールドを新規追加
            let beforeNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            );
            const foundBeforeNote: Note | undefined = [...beforeNotes]
              .reverse()
              .find((note: Note) => ["X", "M", "W"].includes(note.type));
            if (foundBeforeNote) {
              beforeNotes = beforeNotes.filter((note: Note) =>
                foundBeforeNote.type === "M"
                  ? note.rowIdx < foundBeforeNote.rowIdx
                  : note.rowIdx <= foundBeforeNote.rowIdx
              );
            }

            let afterNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx > goal
            );
            const foundAfterNote: Note | undefined = afterNotes.find(
              (note: Note) => ["X", "M", "W"].includes(note.type)
            );
            if (foundAfterNote) {
              afterNotes = afterNotes.filter((note: Note) =>
                foundAfterNote.type === "W"
                  ? note.rowIdx > foundAfterNote.rowIdx
                  : note.rowIdx >= foundAfterNote.rowIdx
              );
            }

            updatedNotes = [...beforeNotes, ...hold, ...afterNotes];
          } else {
            // startとgoalとの間にホールドを新規追加
            updatedNotes = [
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx < start
              ),
              ...hold,
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx > goal
              ),
            ];
          }
        }

        // 元に戻す/やり直すスナップショットの集合を更新
        setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
        setRedoSnapshots([]);

        setIsProtected(true);

        // 単ノート/ホールドの追加・削除を行った譜面に更新
        setNotes(
          notes.map((notes: Note[], column: number) =>
            column === indicator.column ? updatedNotes : notes
          )
        );
      }

      // ホールド設置中の表示パラメーターを初期化
      if (holdSetter !== null) {
        setHoldSetter(null);
      }

      if (selector.setting !== null) {
        // 選択領域入力時の場合は選択領域を入力時→入力後に更新
        // ただし、選択領域の入力時にマウスの座標が譜面から外れた場合はnullに更新
        setSelector({
          completed:
            selector.setting.mouseUpColumn !== null &&
            selector.setting.mouseUpRowIdx !== null
              ? {
                  goalColumn: Math.max(
                    selector.setting.mouseDownColumn,
                    selector.setting.mouseUpColumn
                  ),
                  goalRowIdx: Math.max(
                    selector.setting.mouseDownRowIdx,
                    selector.setting.mouseUpRowIdx
                  ),
                  startColumn: Math.min(
                    selector.setting.mouseDownColumn,
                    selector.setting.mouseUpColumn
                  ),
                  startRowIdx: Math.min(
                    selector.setting.mouseDownRowIdx,
                    selector.setting.mouseUpRowIdx
                  ),
                }
              : null,
          isSettingByMenu: false,
          setting: null,
        });
      }
    },
    [
      holdSetter,
      indicator,
      isPlaying,
      notes,
      position,
      selector.setting,
      setHoldSetter,
      setIsProtected,
      setNotes,
      setRedoSnapshots,
      setSelector,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  return (
    <>
      {[...Array(notes.length)].map((_, column: number) => (
        <div key={column} style={{ display: "flex" }}>
          {column === 0 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
          <div
            onContextMenu={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => {
              event.preventDefault();
              if (!isPlaying) {
                setPosition({
                  top: event.clientY,
                  left: event.clientX,
                });
              }
            }}
            onMouseMove={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => handleMouseMove(event, column)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={{ display: "flex" }}
          >
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: `${noteSize - verticalBorderSize}px`,
              }}
            >
              <ChartVertical
                blockYDists={blockYDists}
                column={column}
                notes={notes[column]}
              />
            </div>
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          </div>
          {column === notes.length - 1 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
        </div>
      ))}
      <ChartIndicator />
      <ChartIndicatorMenu />
      <ChartSelector />
    </>
  );
}

export default Chart;
