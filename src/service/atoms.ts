import { atom } from "recoil";
import { Chart } from "../types/ucs";
import { IndicatorInfo, MouseDownInfo } from "../types/atoms";

export const chartState = atom<Chart>({
  key: "chartState",
  default: {
    length: 5,
    isPerformance: false,
    blocks: [], // ucsファイルを読み込んでいない場合は空配列
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

export const mouseDownInfoState = atom<MouseDownInfo | null>({
  key: "mouseDownInfo",
  default: null,
});

export const topBarTitleState = atom<string>({
  key: "topBarTitle",
  default: "PIU UCS Maker",
});

export const userErrorMessageState = atom<string>({
  key: "userErrorMessage",
  default: "",
});

export const zoomIdxState = atom<number>({
  key: "zoomIdx",
  default: 0,
});
