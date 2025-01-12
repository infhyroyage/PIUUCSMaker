import React, { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useStore } from "../../hooks/useStore";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { ZOOM_VALUES } from "../../services/assets";
import {
  blocksState,
  noteSizeState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../services/atoms";
import { Block, ChartSnapshot, Note } from "../../types/ucs";
import ChartIndicatorMenu from "../menu/ChartIndicatorMenu";
import BorderLine from "./BorderLine";
import ChartIndicator from "./ChartIndicator";
import ChartSelector from "./ChartSelector";
import ChartVertical from "./ChartVertical";

function Chart() {
  const {
    chartIndicatorMenuPosition,
    setChartIndicatorMenuPosition,
    holdSetter,
    setHoldSetter,
    resetHoldSetter,
    indicator,
    setIndicator,
    resetIndicator,
    isPlaying,
    setIsProtected,
    selector,
    setSelector,
    hideSelector,
    zoom,
  } = useStore();
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
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
      if (!!chartIndicatorMenuPosition || isPlaying) return;

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
        if (top !== null && rowIdx !== null) {
          setIndicator({
            blockAccumulatedRows: blocks[blockIdx].accumulatedRows,
            blockIdx,
            column,
            rowIdx,
            top,
          });
        } else {
          resetIndicator();
        }
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
        hideSelector();
      }
    },
    [
      blocks,
      blockYDists,
      chartIndicatorMenuPosition,
      indicator,
      setIndicator,
      resetIndicator,
      isPlaying,
      noteSize,
      selector.setting,
      selector.isSettingByMenu,
      setSelector,
      hideSelector,
      zoom.idx,
    ]
  );

  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // ChartIndicatorMenu表示中/再生中/の場合はNOP
      if (!!chartIndicatorMenuPosition || isPlaying) return;

      // インディケーターを非表示
      resetIndicator();

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
      chartIndicatorMenuPosition,
      isPlaying,
      selector.setting,
      selector.isSettingByMenu,
      resetIndicator,
      setSelector,
    ]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック以外/ChartIndicatorMenu表示中/再生中/押下した瞬間にインディケーターが非表示の場合はNOP
      if (
        event.button !== 0 ||
        !!chartIndicatorMenuPosition ||
        isPlaying ||
        indicator === null
      )
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
        hideSelector();
      }
    },
    [
      chartIndicatorMenuPosition,
      holdSetter,
      indicator,
      isPlaying,
      selector,
      setHoldSetter,
      setSelector,
      hideSelector,
    ]
  );

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック以外/ChartIndicatorMenu表示中/再生中/別々の列を跨いだマウス操作の場合はNOP
      if (event.button !== 0 || !!chartIndicatorMenuPosition || isPlaying)
        return;

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
        resetHoldSetter();
      }

      if (selector.setting !== null) {
        // 選択領域入力時の場合は選択領域を入力時→入力後に更新
        // ただし、選択領域の入力時にマウスの座標が譜面から外れた場合はnullに更新
        if (
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ) {
          setSelector({
            completed: {
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
            },
            isSettingByMenu: false,
            setting: null,
          });
        } else {
          hideSelector();
        }
      }
    },
    [
      chartIndicatorMenuPosition,
      holdSetter,
      indicator,
      isPlaying,
      notes,
      selector.setting,
      resetHoldSetter,
      setIsProtected,
      setNotes,
      setRedoSnapshots,
      setSelector,
      hideSelector,
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
                setChartIndicatorMenuPosition({
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
