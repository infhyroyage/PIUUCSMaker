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

  // Calculate total numbers of rows in all chart blocks
  const totalRows = useMemo(
    () =>
      blocks[blocks.length - 1].accumulatedRows +
      blocks[blocks.length - 1].rows,
    [blocks]
  );

  const handleCopy = useCallback(() => {
    // NOP if the selection area is not displayed or inputting
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
    // NOP if the selection area is not displayed or inputting
    if (selector.completed === null) return;

    handleCopy();

    // Update a set of undo/redo snapshots
    pushUndoSnapshot({ blocks: null, notes });
    resetRedoSnapshots();

    setIsProtected(true);

    // Cut only single note, starting point of hold, setting point of hold or end point of hold included in the selection area
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
    // NOP if the indicator is not displayed or nothing has been copied
    if (indicator === null || clipBoard === null) return;

    // Update a set of undo/redo snapshots
    pushUndoSnapshot({ blocks: null, notes });
    resetRedoSnapshots();

    setIsProtected(true);

    // Paste only single note, starting point of hold, setting point of hold or end point of hold
    // in the common area between the copied selection area with the indicator at the top left
    // and the chart area composed of each chart block
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

    // Set the pasted area as the selection area
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
