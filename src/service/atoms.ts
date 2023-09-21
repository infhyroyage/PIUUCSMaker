import { atom } from "recoil";
import { Block, Note } from "../types/chart";
import { Zoom } from "../types/chart";
import { MouseDown } from "../types/chart";
import { Indicator } from "../types/chart";

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

export const isOpenedNewUCSDialogState = atom<boolean>({
  key: "isOpenedNewUCSDialog",
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

/**
 * mp3ファイル名(拡張子込)
 * 未アップロード時はundefined
 */
export const mp3NameState = atom<string | null>({
  key: "mp3Name",
  default: null,
});

export const notesState = atom<Note[][]>({
  key: "notes",
  default: [],
});

export const noteSizeState = atom<number>({
  key: "noteSize",
  default: 0,
});

/**
 * ucsファイル名(拡張子込)
 * 未アップロード時はundefined
 */
export const ucsNameState = atom<string | null>({
  key: "ucsName",
  default: null,
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
