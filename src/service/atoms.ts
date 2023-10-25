import { atom } from "recoil";
import { Block, Note } from "../types/ucs";
import { HoldSetter, Selector } from "../types/chart";
import { ChartSnapshot } from "../types/ucs";
import { Indicator } from "../types/chart";
import { ClipBoard } from "../types/ucs";
import { ChartIndicatorMenuPosition, Zoom } from "../types/menu";
import { BlockControllerMenuPosition } from "../types/menu";

/**
 * BlockControllerMenuのメニュー対象の譜面のブロックのインデックス
 * メニューを開いていない場合はnull
 */
export const blockControllerMenuBlockIdxState = atom<number | null>({
  key: "blockControllerMenuBlockIdx",
  default: null,
});

/**
 * BlockControllerMenuのメニューを開くブラウザの画面の座標
 * BlockControllerMenuのメニューが非表示の場合はundefined
 */
export const blockControllerMenuPositionState =
  atom<BlockControllerMenuPosition>({
    key: "blockControllerMenuPosition",
    default: undefined,
  });

/**
 * 譜面のブロックの集合
 */
export const blocksState = atom<Block[]>({
  key: "blocks",
  default: [],
});

/**
 * ChartIndicatorMenuのメニューを開くブラウザの画面の座標
 * ChartIndicatorMenuのメニューが非表示の場合はundefined
 */
export const chartIndicatorMenuPositionState = atom<ChartIndicatorMenuPosition>(
  {
    key: "chartIndicatorMenuPosition",
    default: undefined,
  }
);

/**
 * 選択領域に含まれるCopiedNoteの集合をコピーできるクリップボード
 * 1度もコピーしていない場合はnull
 */
export const clipBoardState = atom<ClipBoard>({
  key: "clipBoard",
  default: null,
});

/**
 * 列数
 * Single/SinglePerformance譜面の場合は5、Double/DoublePerformance譜面の場合は10
 * TODO: notesStateの第1インデックスの個数で判断できるため削除したい
 */
export const columnsState = atom<5 | 10>({
  key: "columns",
  default: 5,
});

/**
 * ホールド設置中の表示パラメーター
 * ホールド設置中ではない場合はnull
 */
export const holdSetterState = atom<HoldSetter>({
  key: "holdSetter",
  default: null,
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
 * AdjustBlockDialogを表示する場合はtrue、表示しない場合はfalse
 */
export const isOpenedAdjustBlockDialogState = atom<boolean>({
  key: "isOpenedAdjustBlockDialog",
  default: false,
});

/**
 * EditBlockDialogを表示する場合はtrue、表示しない場合はfalse
 */
export const isOpenedEditBlockDialogState = atom<boolean>({
  key: "isOpenedEditBlockDialog",
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
 * 編集中の離脱を抑止する場合はtrue、そうでない場合はfalse
 */
export const isProtectedState = atom<boolean>({
  key: "isProtected",
  default: false,
});

/**
 * mp3ファイル名(拡張子込)
 * 未アップロード時はnull
 */
export const mp3NameState = atom<string | null>({
  key: "mp3Name",
  default: null,
});

/**
 * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の集合
 */
export const notesState = atom<Note[][]>({
  key: "notes",
  default: [],
});

/**
 * 正方形である単ノートの1辺のサイズ(px)
 */
export const noteSizeState = atom<number>({
  key: "noteSize",
  default: 0,
});

/**
 * やり直すChartSnapshotの集合
 * インデックスが増えるに連れ、過去の編集操作となる
 */
export const redoSnapshotsState = atom<ChartSnapshot[]>({
  key: "redoSnapshots",
  default: [],
});

/**
 * 選択領域の表示パラメーター
 */
export const selectorState = atom<Selector>({
  key: "selector",
  default: { setting: null, completed: null },
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

/**
 * 元に戻すChartSnapshotの集合
 * インデックスが増えるに連れ、最新の編集操作となる
 */
export const undoSnapshotsState = atom<ChartSnapshot[]>({
  key: "undoSnapshots",
  default: [],
});

export const userErrorMessageState = atom<string>({
  key: "userErrorMessage",
  default: "",
});

export const volumeValueState = atom<number>({
  key: "volumeValue",
  default: 0.5,
});

/**
 * 拡大/縮小時の表示パラメーター
 */
export const zoomState = atom<Zoom>({
  key: "zoom",
  default: { idx: 0, top: null },
});
