import { atom } from "recoil";
import { Block, Note } from "../types/ucs";
import { HoldSetter, Selector } from "../types/chart";
import { ChartSnapshot } from "../types/ucs";
import { Indicator } from "../types/chart";
import { ClipBoard } from "../types/ucs";
import { ChartIndicatorMenuPosition, Zoom } from "../types/menu";
import { BlockControllerMenuPosition } from "../types/menu";

/**
 * Chart block index opening BlockControllerMenu
 * null if BlockControllerMenu is invisible
 */
export const blockControllerMenuBlockIdxState = atom<number | null>({
  key: "blockControllerMenuBlockIdx",
  default: null,
});

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
 * Display parameter when setting a hold
 * null if not setting a hold
 */
export const holdSetterState = atom<HoldSetter>({
  key: "holdSetter",
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
 * true for dark mode, false for light mode
 */
export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

/**
 * true if beat sound is mute, otherwise false
 */
export const isMuteBeatsState = atom<boolean>({
  key: "isMuteBeats",
  default: true,
});

/**
 * true if AdjustBlockDialog is visible, otherwise false
 */
export const isOpenedAdjustBlockDialogState = atom<boolean>({
  key: "isOpenedAdjustBlockDialog",
  default: false,
});

/**
 * true if EditBlockDialog is visible, otherwise false
 */
export const isOpenedEditBlockDialogState = atom<boolean>({
  key: "isOpenedEditBlockDialog",
  default: false,
});

/**
 * true if MenuDrawer is expanded, otherwise false
 */
export const isOpenedMenuDrawerState = atom<boolean>({
  key: "isOpenedMenuDrawer",
  default: false,
});

/**
 * true if NewUCSDialog is visible, otherwise false
 */
export const isOpenedNewUCSDialogState = atom<boolean>({
  key: "isOpenedNewUCSDialog",
  default: false,
});

/**
 * true if AggregateDialog is visible, otherwise false
 */
export const isOpenedAggregateDialogState = atom<boolean>({
  key: "isOpenedAggregateDialog",
  default: false,
});

/**
 * true if chart is single performance or double performance,
 * false if chart is single or double
 */
export const isPerformanceState = atom<boolean>({
  key: "isPerformance",
  default: false,
});

/**
 * true if playing the chart, otherwise false
 */
export const isPlayingState = atom<boolean>({
  key: "isPlaying",
  default: false,
});

/**
 * true to prevent exit during editing, otherwise false
 */
export const isProtectedState = atom<boolean>({
  key: "isProtected",
  default: false,
});

/**
 * MP3 file name included a extension
 * numm if nothing is uploaded
 */
export const mp3NameState = atom<string | null>({
  key: "mp3Name",
  default: null,
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
 * Message displayed SuccessSnackbar
 */
export const successMessageState = atom<string>({
  key: "successMessage",
  default: "",
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
 * Message displayed UserErrorSnackbar
 */
export const userErrorMessageState = atom<string>({
  key: "userErrorMessage",
  default: "",
});

/**
 * Volume value
 * 0 for mute, 1 for max
 */
export const volumeValueState = atom<number>({
  key: "volumeValue",
  default: 0.5,
});

/**
 * Display parameter for zoooming in or out
 */
export const zoomState = atom<Zoom>({
  key: "zoom",
  default: { idx: 0, top: null },
});
