import { atom } from "recoil";
import { Chart } from "../types/ucs";
import { FileNames, Indicator, MouseDown, Zoom } from "../types/atoms";

export const chartState = atom<Chart>({
  key: "chartState",
  default: {
    length: 5,
    isPerformance: false,
    blocks: [],
    notes: [],
  },
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
