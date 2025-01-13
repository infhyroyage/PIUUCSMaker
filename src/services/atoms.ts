import { atom } from "recoil";
import { ChartSnapshot } from "../types/ucs";

/**
 * A set of ChartSnapshot for undoing
 * Become recent editing as increasing the index
 */
export const undoSnapshotsState = atom<ChartSnapshot[]>({
  key: "undoSnapshots",
  default: [],
});
