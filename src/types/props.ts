export type ChartBorderLineProps = {
  /**
   * 高さ(px単位)
   */
  height: number | string;

  /**
   * 幅(px単位)
   */
  width: number | string;
};

/**
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export type Indicator = null | {
  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

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
 * マウス押下時のパラメーター
 * マウス押下していない場合はnull
 */
export type MouseDown = null | {
  /**
   * マウス押下時の譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * マウス押下時の行のtop値
   */
  top: number;
};
/**
 * ChartIndicatorのprops
 */
export type ChartIndicatorProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;

  /**
   * マウス押下時のパラメーター
   * マウス押下していない場合はnull
   */
  mouseDown: MouseDown;
};

/**
 * ChartRectangleのprops
 */
export type ChartRectangleProps = {
  /**
   * 譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * 高さ(px単位)
   */
  height: number;
};

/**
 * ChartVerticalのprops
 */
export type ChartVerticalProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;

  /**
   * マウス押下時のパラメーター
   * マウス押下していない場合はnull
   */
  mouseDown: MouseDown;

  /**
   * 各インディケーターの表示パラメーターの設定関数
   */
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;

  /**
   * 各マウス押下時のパラメーターの設定関数
   */
  setMouseDowns: React.Dispatch<React.SetStateAction<MouseDown[]>>;
};

/**
 * ChartVerticalRectanglesのprops
 */
export type ChartVerticalRectanglesProps = {
  /**
   * 譜面のブロックのインデックス
   */
  blockIdx: number;
};

/**
 * ChartVerticalNoteImagesのprops
 */
export type ChartVerticalNoteImagesProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の譜面全体での行インデックス
   */
  idx: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロックの1行あたりの高さ(px単位)
   */
  unitRowHeight: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の譜面全体での行インデックスでの、ブラウザの画面のy座標
   */
  y: number;
};
