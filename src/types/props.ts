export type ChartBorderLineProps = {
  height: string;
  width: string;
};

/**
 * インディケーターの表示パラメーター
 */
export type IndicatorInfo = {
  /**
   * インディケーターのtop値
   */
  top: number;

  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * インディケーターの示す譜面全体での行のインデックス
   */
  rowIdx: number;
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
   * インディケーターの表示パラメーター
   * インディケーターを表示しない場合はnull
   */
  indicatorInfo: IndicatorInfo | null;

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

export type MenuBarProps = {
  isDarkMode: boolean;
  isOpenedDrawer: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenedDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};
