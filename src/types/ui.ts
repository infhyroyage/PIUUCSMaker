import { PopoverPosition } from "@mui/material";

/**
 * BlockControllerMenuのメニューを開くブラウザの画面の座標
 * BlockControllerMenuのメニューが非表示の場合はundefined
 */
export type BlockControllerMenuPosition = PopoverPosition | undefined;

/**
 * ホールド設置中の表示パラメーター
 * ホールド設置中ではない場合はnull
 */
export type HoldSetter = null | {
  /**
   * ホールド設置開始地点での列インデックス
   */
  column: number;

  /**
   * ChartIndicatorMenuの「Starting Setting Hold」からホールド設置を開始する場合はtrue、
   * ドラッグアンドドロップ操作からホールド設置を開始する場合はfalse
   */
  isSettingByMenu: boolean;

  /**
   * ホールド設置開始地点での譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * ホールド設置開始地点での行のtop値(px)
   */
  top: number;
};

/**
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export type Indicator = null | {
  /**
   * インディケーターの示す譜面のブロックから以前までの譜面のブロックの行数の総和
   */
  blockAccumulatedRows: number;

  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * インディケーターの列インデックス
   */
  column: number;

  /**
   * インディケーターの示す譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * インディケーターのtop値(px)
   */
  top: number;
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
 * 選択領域の表示パラメーター
 */
export type Selector = {
  /**
   * 選択領域入力後のマウスの各座標
   * 選択領域未入力/入力時の場合はnull
   */
  completed: null | SelectorMouseCords;

  /**
   * 選択領域の入力時のマウスの各座標
   * 選択領域未入力/入力済の場合はnull
   */
  setting:
    | null
    | (SelectorMouseCords & {
        /**
         * ChartIndicatorMenuの「Starting Selecting」から選択領域を入力する場合はtrue、
         * Shiftキー入力したままドラッグアンドドロップ操作から選択領域を入力する場合はfalse
         */
        isSettingByMenu: boolean;
      });
};

/**
 * 選択領域の入力開始時、および、入力時/入力終了時のマウスの各座標を構成するパラメーター
 */
export type SelectorMouseCords = {
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
 * 拡大/縮小時の表示パラメーター
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
