export type ChartBorderLineProps = {
  /**
   * 高さ(px単位)
   */
  height: string;

  /**
   * 場(px単位)
   */
  width: string;
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
 * ChartVerticalRectanglesのprops
 */
export type ChartVerticalRectanglesProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;
};
