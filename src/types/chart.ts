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
 * 選択領域の表示パラメーター
 */
export type Selector = {
  /**
   * 選択領域入力後のマウスの各座標
   * 選択領域未入力/入力時の場合はnull
   */
  completed: null | SelectorCompletedCords;

  /**
   * ChartIndicatorMenuの「Starting Selecting」からの選択領域入力中の場合はtrue、
   * 選択領域未入力/入力済の場合や、Shiftキー入力したままドラッグアンドドロップ操作からの選択領域入力中の場合はfalse
   */
  isSettingByMenu: boolean;

  /**
   * 選択領域の入力時のマウスの各座標
   * 選択領域未入力/入力済の場合はnull
   */
  setting: null | SelectorSettingCords;
};

/**
 * 選択領域入力後の座標を構成するパラメーター
 */
export type SelectorCompletedCords = {
  /**
   * 選択領域の右下の列インデックス
   */
  goalColumn: number;

  /**
   * 選択領域の右下の譜面全体での行インデックス
   */
  goalRowIdx: number;

  /**
   * 選択領域の左上の列インデックス
   */
  startColumn: number;

  /**
   * 選択領域の左上の譜面全体での行インデックス
   */
  startRowIdx: number;
};

/**
 * 選択領域の入力開始時・入力時のマウスの座標を構成するパラメーター
 */
export type SelectorSettingCords = {
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
   * 選択領域の入力時のマウスの座標での列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   * 選択領域の入力時にマウスの座標が譜面から外れた場合はnull
   */
  mouseUpColumn: number | null;

  /**
   * 選択領域の入力時のマウスの座標での譜面全体での行インデックス
   * 選択領域の入力時にマウスの座標が譜面から外れた場合はnull
   */
  mouseUpRowIdx: number | null;
};
