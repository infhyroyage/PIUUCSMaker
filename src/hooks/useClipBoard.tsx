import { useCallback, useEffect, useMemo } from "react";
import { Block, Note } from "../types/ucs";
import { SelectorCompletedCords, Selector } from "../types/chart";
import { ChartSnapshot } from "../types/ucs";
import { Indicator } from "../types/chart";
import { ClipBoard } from "../types/ucs";
import { CopiedNote } from "../types/ucs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  clipBoardState,
  columnsState,
  indicatorState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
} from "../service/atoms";

function useClipBoard() {
  const [clipBoard, setClipBoard] = useRecoilState<ClipBoard>(clipBoardState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [selector, setSelector] = useRecoilState<Selector>(selectorState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const columns = useRecoilValue<5 | 10>(columnsState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  // 全譜面のブロックの行数の総和を計算
  const totalRows = useMemo(
    () =>
      blocks[blocks.length - 1].accumulatedRows +
      blocks[blocks.length - 1].rows,
    [blocks]
  );

  const handleCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (selector.completed === null) return;

    const completedCords: SelectorCompletedCords = selector.completed;
    setClipBoard({
      columnLength: completedCords.goalColumn + 1 - completedCords.startColumn,
      copiedNotes: [
        ...Array(completedCords.goalColumn - completedCords.startColumn + 1),
      ]
        .map((_, deltaColumn: number) =>
          notes[completedCords.startColumn + deltaColumn]
            .filter(
              (note: Note) =>
                note.rowIdx >= completedCords.startRowIdx &&
                note.rowIdx <= completedCords.goalRowIdx
            )
            .map((note: Note) => {
              return {
                deltaColumn,
                deltaRowIdx: note.rowIdx - completedCords.startRowIdx,
                type: note.type,
              };
            })
        )
        .flat(),
      rowLength: completedCords.goalRowIdx + 1 - completedCords.startRowIdx,
    });
  }, [notes, selector.completed, setClipBoard]);

  const handleCut = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (selector.completed === null) return;

    handleCopy();

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
    setRedoShapshots([]);

    setIsProtected(true);

    // 選択領域に含まれる領域のみ、単ノート/ホールドの始点/ホールドの中間/ホールドの終点のカット対象とする
    const completedCords: SelectorCompletedCords = selector.completed;
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < completedCords.startColumn ||
        column > completedCords.goalColumn
          ? ns
          : [
              ...ns.filter(
                (note: Note) =>
                  note.rowIdx < completedCords.startRowIdx ||
                  note.rowIdx > completedCords.goalRowIdx
              ),
            ]
      )
    );
  }, [
    handleCopy,
    notes,
    selector.completed,
    setIsProtected,
    setNotes,
    setRedoShapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const handlePaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
    setRedoShapshots([]);

    setIsProtected(true);

    // インディケーターの位置を左上としたコピー時の選択領域に含まれる領域と、
    // 各譜面のブロックで構成した譜面の領域との共通領域のみ、
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点のペースト対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < indicator.column ||
        column > indicator.column + clipBoard.columnLength - 1
          ? ns
          : [
              ...ns.filter((note: Note) => note.rowIdx < indicator.rowIdx),
              ...clipBoard.copiedNotes
                .filter(
                  (copiedNote: CopiedNote) =>
                    copiedNote.deltaColumn === column - indicator.column &&
                    indicator.rowIdx + copiedNote.deltaRowIdx < totalRows
                )
                .map((copiedNote: CopiedNote) => {
                  return {
                    rowIdx: indicator.rowIdx + copiedNote.deltaRowIdx,
                    type: copiedNote.type,
                  };
                }),
              ...ns.filter(
                (note: Note) =>
                  note.rowIdx > indicator.rowIdx + clipBoard.rowLength - 1
              ),
            ]
      )
    );

    // ペースト対象の領域を選択領域として設定
    setSelector({
      completed: {
        startColumn: indicator.column,
        startRowIdx: indicator.rowIdx,
        goalColumn:
          Math.min(indicator.column + clipBoard.columnLength, columns) - 1,
        goalRowIdx:
          Math.min(indicator.rowIdx + clipBoard.rowLength, totalRows) - 1,
      },
      isSettingByMenu: false,
      setting: null,
    });
  }, [
    clipBoard,
    columns,
    indicator,
    notes,
    setIsProtected,
    setNotes,
    setRedoShapshots,
    setSelector,
    setUndoSnapshots,
    totalRows,
    undoSnapshots,
  ]);

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "c":
            handleCopy();
            break;
          case "v":
            handlePaste();
            break;
          case "x":
            handleCut();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleCut, handlePaste]);

  return { handleCut, handleCopy, handlePaste };
}

export default useClipBoard;
