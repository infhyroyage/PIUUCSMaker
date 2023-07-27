import { atom } from "recoil";

export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
});

export const userErrorMessageState = atom<string>({
  key: "userErrorMessageState",
  default: "",
});
