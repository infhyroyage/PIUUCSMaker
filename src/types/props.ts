import { MouseDown, Note } from "./chart";
import { Indicator } from "./chart";

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
   * 全譜面のブロックのうち自身が偶数番目の場合はtrue、奇数番目の場合はfalse
   */
  isEven: boolean;

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
   * 各譜面のブロックを設置するトップバーからのy座標の距離(px単位)
   */
  blockYDists: number[];

  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 列インデックスcolumnにおける、インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;

  /**
   * 列インデックスcolumnにおける、マウス押下時のパラメーター
   * マウス押下していない場合はnull
   */
  mouseDown: MouseDown;

  /**
   * 列インデックスcolumnにおける、単ノート/ホールドの始点/ホールドの中間/ホールドの終点の集合
   */
  notes: Note[];

  /**
   * 各譜面のブロックの1行あたりの高さ(px単位)
   * 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
   * 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
   */
  unitRowHeights: number[];
};

/**
 * ChartVerticalRectanglesのprops
 */
export type ChartVerticalRectanglesProps = {
  /**
   * 譜面のブロックのBeat値
   */
  beat: number;

  /**
   * 全譜面のブロックのうち自身が偶数番目の場合はtrue、奇数番目の場合はfalse
   */
  isEven: boolean;

  /**
   * 全譜面のブロックのうち自身が最後の場合はtrue、そうでない場合はfalse
   */
  isLastBlock: boolean;

  /**
   * 譜面のブロックの行数
   */
  length: number;

  /**
   * 譜面のブロックのSplit値
   */
  split: number;

  /**
   * 譜面のブロックの1行あたりの高さ(px単位)
   */
  unitRowHeight: number;
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
