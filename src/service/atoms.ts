import { atom } from "recoil";
import { Chart } from "../types/ucs";
import { FileNames, IndicatorInfo, MouseDownInfo } from "../types/atoms";

export const chartState = atom<Chart>({
  key: "chartState",
  default: {
    length: 5,
    isPerformance: false,
    blocks: [],
    notes: [],
  },
});

export const indicatorInfoState = atom<IndicatorInfo | null>({
  key: "indicatorInfo",
  default: null,
});

export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

export const isOpenedMenuDrawerState = atom<boolean>({
  key: "isOpenedMenuDrawer",
  default: false,
});

export const isOpenedNewFileDialogState = atom<boolean>({
  key: "isOpenedNewFileDialog",
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

export const fileNamesState = atom<FileNames>({
  key: "fileNames",
  default: {},
});

export const mouseDownInfoState = atom<MouseDownInfo | null>({
  key: "mouseDownInfo",
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

export const zoomIdxState = atom<number>({
  key: "zoomIdx",
  default: 0,
});
