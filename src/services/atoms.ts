import { atom } from "recoil";
import { Indicator, Selector } from "../types/chart";
import {
  BlockControllerMenuPosition,
  ChartIndicatorMenuPosition,
  Zoom,
} from "../types/menu";
import { Block, ChartSnapshot, ClipBoard, Note } from "../types/ucs";

/**
 * Coordinate of the browser screen opening BlockControllerMenu
 * undefined if BlockControllerMenu is invisible
 */
export const blockControllerMenuPositionState =
  atom<BlockControllerMenuPosition>({
    key: "blockControllerMenuPosition",
    default: undefined,
  });

/**
 * A set of chart block
 */
export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
});

/**
 * Coordinate of the browser screen opening ChartIndicatorMenu
 * undefined if ChartIndicatorMenu is invisible
 */
export const chartIndicatorMenuPositionState = atom<ChartIndicatorMenuPosition>(
  {
    key: "chartIndicatorMenuPosition",
    default: undefined,
  }
);

/**
 * Clipboard to copy and paste a set of single note, starting point of hold, setting point of hold or end point of hold included in the selection area
 * null if nothing has ever been copied
 */
export const clipBoardState = atom<ClipBoard>({
  key: "clipBoard",
  default: null,
});

/**
 * Display parameter of indicator
 * null if the indicator is not displayed
 */
export const indicatorState = atom<Indicator>({
  key: "indicator",
  default: null,
});

/**
 * true to prevent exit during editing, otherwise false
 */
export const isProtectedState = atom<boolean>({
  key: "isProtected",
  default: false,
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
 * Display parameter of the selection area
 */
export const selectorState = atom<Selector>({
  key: "selector",
  default: { completed: null, isSettingByMenu: false, setting: null },
});

/**
 * UCS file name included a extension
 * numm if nothing is uploaded
 */
export const ucsNameState = atom<string | null>({
  key: "ucsName",
  default: null,
});

/**
 * A set of ChartSnapshot for undoing
 * Become recent editing as increasing the index
 */
export const undoSnapshotsState = atom<ChartSnapshot[]>({
  key: "undoSnapshots",
  default: [],
});

/**
 * Display parameter for zoooming in or out
 */
export const zoomState = atom<Zoom>({
  key: "zoom",
  default: { idx: 0, top: null },
});
