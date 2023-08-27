import { atom } from "recoil";
import { Chart } from "../types/ucs";
import { IndicatorInfo, MouseDownInfo } from "../types/atoms";

export const chartState = atom<Chart | null>({
  key: "chartState",
  default: null,
});

export const indicatorInfoState = atom<IndicatorInfo | null>({
  key: "indicatorInfo",
  default: null,
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
