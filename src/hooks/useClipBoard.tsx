import { useCallback, useMemo } from "react";
import { SelectorCompletedCords } from "../types/chart";
import { CopiedNote, Note } from "../types/ucs";
import { useStore } from "./useStore";

function useClipBoard() {
  const {
    blocks,
    clipBoard,
    setClipBoard,
    indicator,
    setIsProtected,
    notes,
    setNotes,
    resetRedoSnapshots,
    selector,
    setSelector,
    pushUndoSnapshot,
  } = useStore();

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
    pushUndoSnapshot({ blocks: null, notes });
    resetRedoSnapshots();

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
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const handlePaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // 元に戻す/やり直すスナップショットの集合を更新
    pushUndoSnapshot({ blocks: null, notes });
    resetRedoSnapshots();

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
          Math.min(indicator.column + clipBoard.columnLength, notes.length) - 1,
        goalRowIdx:
          Math.min(indicator.rowIdx + clipBoard.rowLength, totalRows) - 1,
      },
      isSettingByMenu: false,
      setting: null,
    });
  }, [
    clipBoard,
    indicator,
    notes,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    setSelector,
    pushUndoSnapshot,
    totalRows,
  ]);

  return { handleCut, handleCopy, handlePaste };
}

export default useClipBoard;
