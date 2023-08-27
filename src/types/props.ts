export type ChartBorderLineProps = {
  height: string;
  width: string;
};

/**
 * 関数コンポーネントChartIndicatorで用いるprops
 */
export type ChartIndicatorProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 単ノートの1辺のサイズ(px単位)
   */
  noteSize: number;
};

export type ChartRectangleProps = {
  blockIdx: number;
  height: number;
};

export type ChartVerticalRectanglesProps = {
  borderSize: number;
  column: number;
  noteSize: number;
};
