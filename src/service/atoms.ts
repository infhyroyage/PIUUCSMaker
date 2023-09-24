import { atom } from "recoil";
import { Block, Note } from "../types/chart";
import { Zoom } from "../types/chart";
import { MouseDown } from "../types/chart";
import { Indicator } from "../types/chart";
import { EditBlockDialogForm } from "../types/form";
import { PopoverPosition } from "@mui/material";

export const blockControllerMenuPositionState = atom<
  PopoverPosition | undefined
>({
  key: "blockControllerMenuPosition",
  default: undefined,
});

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

/**
 * EditBlockDialogの表示フラグ・入力値
 */
export const editBlockDialogFormState = atom<EditBlockDialogForm>({
  key: "editBlockDialogForm",
  default: {
    beat: "",
    blockIdx: -1,
    bpm: "",
    delay: "",
    open: false,
    split: "",
  },
});

export const indicatorsState = atom<Indicator[]>({
  key: "indicators",
  default: new Array<Indicator>(10).fill(null),
});

/**
 * ダークモードの場合はtrue、ライトモードの場合はfalse
 */
export const isDarkModeState = atom<boolean>({
  key: "isDarkMode",
  default: false,
});

/**
 * ビート音をミュートにしている場合はtrue、そうではない場合はfalse
 */
export const isMuteBeatsState = atom<boolean>({
  key: "isMuteBeats",
  default: true,
});

/**
 * MenuDrawerを展開する場合はtrue、展開しない場合はfalse
 */
export const isOpenedMenuDrawerState = atom<boolean>({
  key: "isOpenedMenuDrawer",
  default: false,
});

/**
 * NewUCSDialogを表示する場合はtrue、表示しない場合はfalse
 */
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

/**
 * SystemErrorSnackbarを表示する場合はtrue、表示しない場合はfalse
 */
export const isShownSystemErrorSnackbarState = atom<boolean>({
  key: "isShownSystemErrorSnackbar",
  default: false,
});

/**
 * MenuBarの高さ(px単位)
 */
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
 * 未アップロード時はnull
 */
export const mp3NameState = atom<string | null>({
  key: "mp3Name",
  default: null,
});

export const notesState = atom<Note[][]>({
  key: "notes",
  default: [],
});

/**
 * 正方形である単ノートの1辺のサイズ(px単位)
 */
export const noteSizeState = atom<number>({
  key: "noteSize",
  default: 0,
});

export const successMessageState = atom<string>({
  key: "successMessage",
  default: "",
});

/**
 * ucsファイル名(拡張子込)
 * 未アップロード時はnull
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
