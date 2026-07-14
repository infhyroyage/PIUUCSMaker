import { useCallback } from "react";
import { SelectorCompletedCords } from "../types/chart";
import { Note } from "../types/ucs";
import { useStore } from "./useStore";

function useSelectedDeleting() {
  const {
    notes,
    setNotes,
    setIsProtected,
    resetRedoSnapshots,
    selector,
    pushUndoSnapshot,
  } = useStore();

  /**
   * Delete all single note, starting point of hold, setting point of hold or end point of hold in the inputted selection area
   * @returns
   */
  const handleDelete = useCallback(() => {
    // NOP if the selection area is not displayed or inputting
    if (selector.completed === null) return;

    // Update a set of undo/redo snapshots
    pushUndoSnapshot({ blocks: null, notes });
    resetRedoSnapshots();

    setIsProtected(true);

    const completedCords: SelectorCompletedCords = selector.completed;
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < completedCords.startColumn ||
        column > completedCords.goalColumn
          ? // Keep as-is if the column index is outside the selection area
            ns
          : [
              // Extract only row indexes in the entire chart outside the selection area
              ...ns.filter(
                (note: Note) => note.rowIdx < completedCords.startRowIdx
              ),
              ...ns.filter(
                (note: Note) => note.rowIdx > completedCords.goalRowIdx
              ),
            ]
      )
    );
  }, [
    notes,
    selector.completed,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  return { handleDelete };
}

export default useSelectedDeleting;
