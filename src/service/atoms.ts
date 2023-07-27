import { atom } from "recoil";

export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
});

export const isShownTopBarProgressState = atom<boolean>({
  key: "isShownTopBarProgress",
  default: false,
});

export const topBarTitleState = atom<string>({
  key: "topBarTitle",
  default: "PIU UCS Maker",
});

export const userErrorMessageState = atom<string>({
  key: "userErrorMessageState",
  default: "",
});
