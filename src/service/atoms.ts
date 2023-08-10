import { atom } from "recoil";

export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
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
