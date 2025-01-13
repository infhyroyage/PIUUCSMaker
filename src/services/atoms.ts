import { atom } from "recoil";
import { Block, ChartSnapshot } from "../types/ucs";

/**
 * A set of chart block
 */
export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
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
