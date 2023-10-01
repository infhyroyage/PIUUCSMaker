import { PopoverPosition } from "@mui/material";
import { CopiedNote } from "./chart";

/**
 * BlockControllerMenuのメニューの座標を構成するパラメーター
 */
export type BlockControllerMenuPosition = {
  /**
   * メニューを開く対象の譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * メニューを開くブラウザの画面の座標
   */
  position?: PopoverPosition;
};

/**
 * 選択領域に含まれるCopiedNoteの集合をコピーできるクリップボード
 * 1度もコピーしていない場合はnull
 */
export type ClipBoard = null | {
  /**
   * コピー時の選択領域の列の長さ
   */
  columnLength: number;

  /**
   * CopiedNoteの集合
   */
  copiedNotes: CopiedNote[];

  /**
   * コピー時の選択領域の行の長さ
   */
  rowLength: number;
};

/**
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export type Indicator = null | {
  /**
   * インディケーターの示す譜面のブロックから以前までの譜面のブロックの行数の総和
   */
  blockAccumulatedLength: number;

  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * インディケーターの列インデックス
   */
  column: number;

  /**
   * マウス押下時の列インデックス
   * 譜面にマウスを押下していない場合はnull
   */
  mouseDownColumn: number | null;

  /**
   * マウス押下時の譜面全体での行のインデックス
   * 譜面にマウスを押下していない場合はnull
   */
  mouseDownRowIdx: number | null;

  /**
   * マウス押下時の行のtop値
   * 譜面にマウスを押下していない場合はnull
   */
  mouseDownTop: number | null;

  /**
   * インディケーターの示す譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * インディケーターのtop値
   */
  top: number;
};

/**
 * 選択領域の入力開始時、および、入力時/入力終了時のマウスの各座標を構成するパラメーター
 */
export type SelectorCords = {
  /**
   * 選択領域の入力開始時のマウスの座標での列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  mouseDownColumn: number;

  /**
   * 選択領域の入力開始時のマウスの座標での譜面全体での行インデックス
   */
  mouseDownRowIdx: number;

  /**
   * 選択領域の入力時/入力終了時のマウスの座標での列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   * 選択領域の入力時にマウスの座標が譜面から外れた場合はnull
   */
  mouseUpColumn: number | null;

  /**
   * 選択領域の入力時/入力終了時のマウスの座標での譜面全体での行インデックス
   * 選択領域の入力時にマウスの座標が譜面から外れた場合はnull
   */
  mouseUpRowIdx: number | null;
};

/**
 * 選択領域入力済の座標を構成するパラメーター
 */
export type SelectedCords = {
  /**
   * 選択領域の終点の列インデックス
   */
  goalColumn: number;

  /**
   * 選択領域の終点の譜面全体での行インデックス
   */
  goalRowIdx: number;

  /**
   * 選択領域の始点の列インデックス
   */
  startColumn: number;

  /**
   * 選択領域の始点の譜面全体での行インデックス
   */
  startRowIdx: number;
};

/**
 * 選択領域のパラメーター
 */
export type Selector = {
  /**
   * 選択領域の入力時の各座標
   * 選択領域未入力/入力済の場合はnull
   */
  changingCords: null | SelectorCords;

  /**
   * 選択領域入力後の各座標
   * 選択領域未入力/入力時の場合はnull
   */
  completedCords: null | SelectorCords;
};

/**
 * 拡大/縮小時のパラメーター
 */
export type Zoom = {
  /**
   * 現在の倍率の値のインデックス
   */
  idx: number;

  /**
   * 拡大/縮小直後のブラウザの画面のy座標
   * 1度も拡大/縮小していない場合はnull
   */
  top: number | null;
};