import { atom } from "recoil";
import { Block, Note } from "../types/ucs";
import { FileNames, Indicator, MouseDown, Zoom } from "../types/atoms";

export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
});

/**
 * 列数
 * Single/SinglePerformance譜面の場合は5、Double/DoublePerformance譜面の場合は10
 */
export const columnsState = atom<5 | 10>({
  key: "columns",
  default: 5,
});

export const fileNamesState = atom<FileNames>({
  key: "fileNames",
  default: {},
});

export const indicatorsState = atom<Indicator[]>({
  key: "indicators",
  default: new Array<Indicator>(10).fill(null),
});

export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

export const isMuteBeatsState = atom<boolean>({
  key: "isMuteBeats",
  default: true,
});

export const isOpenedMenuDrawerState = atom<boolean>({
  key: "isOpenedMenuDrawer",
  default: false,
});

export const isOpenedNewFileDialogState = atom<boolean>({
  key: "isOpenedNewFileDialog",
  default: false,
});

/**
 * SinglePerformance/DoublePerformance譜面の場合はtrue、Single/Double譜面の場合はfalse
 */
export const isPerformanceState = atom<boolean>({
  key: "isPerformance",
  default: false,
});

/**
 * 再生中の場合はtrue、そうでない場合はfalse
 */
export const isPlayingState = atom<boolean>({
  key: "isPlaying",
  default: false,
});

export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
});

export const menuBarHeightState = atom<number>({
  key: "menuBarHeight",
  default: 0,
});

export const mouseDownsState = atom<MouseDown[]>({
  key: "mouseDowns",
  default: new Array<MouseDown>(10).fill(null),
});

export const notesState = atom<Note[][]>({
  key: "notes",
  default: [],
});

export const noteSizeState = atom<number>({
  key: "noteSize",
  default: 0,
});

export const userErrorMessageState = atom<string>({
  key: "userErrorMessage",
  default: "",
});

export const volumeValueState = atom<number>({
  key: "volumeValue",
  default: 0.5,
});

export const zoomState = atom<Zoom>({
  key: "zoom",
  default: { idx: 0, top: null },
});
