import { MouseDown } from "./chart";
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
};

/**
 * ChartVerticalRectanglesのprops
 */
export type ChartVerticalRectanglesProps = {
  /**
   * 譜面のブロックの高さ(px単位)
   */
  blockHeight: number;

  /**
   * 譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * 最後の譜面のブロックの場合はtrue、そうでない場合はfalse
   */
  isLastBlock: boolean;
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
