import { atom } from "recoil";
import { Block, ChartSnapshot, Note } from "../types/ucs";

/**
 * A set of chart block
 */
export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
});

/**
 * A set of single note, starting point of hold, setting point of hold or end point of hold,
 * whose the first index matches the number of columns (5 if chart is single or single performance, 10 if chart is double or double performance)
 */
export const notesState = atom<Note[][]>({
  key: "notes",
  default: [],
});

/**
 * Width or height (px) of single note
 */
export const noteSizeState = atom<number>({
  key: "noteSize",
  default: 0,
});

/**
 * A set of ChartSnapshot for redoing
 * Become past editing as increasing the index
 */
export const redoSnapshotsState = atom<ChartSnapshot[]>({
  key: "redoSnapshots",
  default: [],
});

/**
 * A set of ChartSnapshot for undoing
 * Become recent editing as increasing the index
 */
export const undoSnapshotsState = atom<ChartSnapshot[]>({
  key: "undoSnapshots",
  default: [],
});
