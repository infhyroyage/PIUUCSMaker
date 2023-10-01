import { atom } from "recoil";
import { Block, ClipBoard, Indicator, Note, Selector } from "../types/chart";
import { Zoom } from "../types/chart";
import { EditBlockDialogForm } from "../types/form";
import { PopoverPosition } from "@mui/material";
import { MenuPosition } from "../types/controller";

export const blockControllerMenuPositionState = atom<MenuPosition>({
  key: "blockControllerMenuPosition",
  default: { blockIdx: 0 },
});

export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
});

export const chartIndicatorMenuPositionState = atom<
  PopoverPosition | undefined
>({
  key: "chartIndicatorMenuPosition",
  default: undefined,
});

export const clipBoardState = atom<ClipBoard>({
  key: "clipBoard",
  default: null,
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

/**
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export const indicatorState = atom<Indicator>({
  key: "indicator",
  default: null,
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
 * MenuBarの高さ(px単位)
 */
export const menuBarHeightState = atom<number>({
  key: "menuBarHeight",
  default: 0,
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

/**
 * RectangleIdentifierの横の長さ(px単位)
 */
export const rectangleIdentifierWidthState = atom<number>({
  key: "rectangleIdentifierWidth",
  default: 0,
});

export const selectorState = atom<Selector>({
  key: "selector",
  default: { changingCords: null, completedCords: null },
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
