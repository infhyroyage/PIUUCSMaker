import { useCallback } from "react";
import { SelectorCompletedCords } from "../types/chart";
import { Note } from "../types/ucs";
import { useStore } from "./useStore";

function useSelectedFlipping() {
  const {
    setIsProtected,
    notes,
    setNotes,
    resetRedoSnapshots,
    selector,
    pushUndoSnapshot,
  } = useStore();

  /**
   * Flip all single note, starting point of hold, setting point of hold or end point of hold in the inputted selection area horizontally or vertically
   * @param isHorizontal true for horizontal flip/Mirror, otherwise false
   * @param isVertical true for vertical flip/Mirror, otherwise false
   * @returns
   */
  const handleFlip = useCallback(
    (isHorizontal: boolean, isVertical: boolean) => {
      // NOP if the selection area is not displayed or inputting
      if (selector.completed === null) return;

      // Update a set of undo/redo snapshots
      pushUndoSnapshot({ blocks: null, notes });
      resetRedoSnapshots();

      setIsProtected(true);

      // Calculate all flip sources (from) and destinations (to) for each column index in the selection area
      const completedCords: SelectorCompletedCords = selector.completed;
      const flippedParams: { from: number; to: number }[] = Array.from(
        { length: completedCords.goalColumn - completedCords.startColumn + 1 },
        (_, i) => completedCords.startColumn + i
      ).reduce((prev: { from: number; to: number }[], from: number) => {
        // Prevent double flip
        if (
          prev.find((param: { from: number; to: number }) => param.to === from)
        )
          return prev;

        // Calculate the vertical or horizontal flip destination of the column index
        let to: number = from;
        if (isVertical) {
          to =
            to % 5 === 0 || to % 5 === 3
              ? to + 1
              : to % 5 === 1 || to % 5 === 4
              ? to - 1
              : to;
        }
        if (isHorizontal) {
          to = notes.length - to - 1;
        }
        return [...prev, { from, to }];
      }, []);

      // Flip vertically or horizontally for single note, starting point of hold,
      // setting point of hold or end point of hold at row indexes in the entire chart in the selection area
      const flippedNotes: Note[][] = [...Array(notes.length)].reduce(
        (prev: Note[][], _, column: number) => {
          const foundParam: { from: number; to: number } | undefined =
            flippedParams.find(
              (param: { from: number; to: number }) => param.from === column
            );
          if (foundParam) {
            [prev[foundParam.from], prev[foundParam.to]] = [
              prev[foundParam.to],
              prev[foundParam.from],
            ];
          }
          return prev;
        },
        notes.map((ns: Note[]) =>
          ns.filter(
            (note: Note) =>
              note.rowIdx >= completedCords.startRowIdx &&
              note.rowIdx <= completedCords.goalRowIdx
          )
        )
      );

      setNotes(
        notes.map((ns: Note[], column: number) => [
          ...ns.filter(
            (note: Note) => note.rowIdx < completedCords.startRowIdx
          ),
          ...flippedNotes[column],
          ...ns.filter((note: Note) => note.rowIdx > completedCords.goalRowIdx),
        ])
      );
    },
    [
      notes,
      selector.completed,
      setIsProtected,
      setNotes,
      resetRedoSnapshots,
      pushUndoSnapshot,
    ]
  );

  return { handleFlip };
}

export default useSelectedFlipping;
