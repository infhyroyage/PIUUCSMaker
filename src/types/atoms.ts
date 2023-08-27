/**
 * インディケーターの表示パラメーター
 */
export type IndicatorInfo = {
  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * インディケーターの示す列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

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
 */
export type MouseDownInfo = {
  /**
   * マウス押下時の列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * マウス押下時の行のインデックス
   */
  rowIdx: number;
  /**
   * マウス押下時の行のtop値
   */
  top: number;
};
