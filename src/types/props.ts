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
   * ホールドの終点の画像のtop値
   * startTopの値より大きい場合はホールドとみなす
   * それ以外の場合は場合は単ノートとみなし、goalTopの値を無視する
   */
  goalTop: number;

  /**
   * 単ノート/ホールドの始点の画像のtop値
   */
  startTop: number;

  /**
   * 単ノート/ホールドの始点の画像のz-index値
   */
  startZIndex: number;
};
