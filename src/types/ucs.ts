/**
 * 単ノート/ホールド/中抜きホールド
 */
export type Note = {
  /**
   * 単ノート/ホールド/中抜きホールドの始点の譜面全体での行インデックス
   * 単ノートの場合はgoalと同じ値
   */
  start: number;

  /**
   * 単ノート/ホールド/中抜きホールドの終点の譜面全体での行インデックス
   * 単ノートの場合はstartと同じ値
   */
  goal: number;

  /**
   * 中抜きホールドの中間にかぶせる始点の譜面全体での行インデックスの配列
   * 単ノート/中抜きの無いホールドの場合は要素数0の配列
   */
  hollowStarts: number[];

  /**
   * 中抜きホールドの中間にかぶせる終点の譜面全体での行インデックスの配列
   * 単ノート/中抜きの無いホールドの場合は要素数0の配列
   */
  hollowGoals: number[];
};

/**
 * 譜面のブロック
 */
export type Block = {
  /**
   * BPM値
   * 有効数字7桁までの0.1〜999が有効範囲
   */
  bpm: number;

  /**
   * Delay値
   * 単位はbeatを使用せずmsで統一
   * 有効数字7桁までの-999999〜999999が有効範囲
   */
  delay: number;

  /**
   * Beat値
   * 1〜64が有効範囲
   */
  beat: number;

  /**
   * Split値
   * 1〜128が有効範囲
   */
  split: number;

  /**
   * 行数
   */
  length: number;

  /**
   * 列ごとの単ノート/ホールド/中抜きホールドの集合
   * Single/SinglePerformance譜面の場合の第1インデックスは0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  notes: Note[][];
};

/**
 * UCSファイルに記載する譜面
 */
export type Chart = {
  /**
   * 列数
   * Single/SinglePerformance譜面の場合は5、Double/DoublePerformance譜面の場合は10
   */
  length: 5 | 10;

  /**
   * Single/Double譜面の場合はtrue、
   * SinglePerformance/DoublePerformance譜面の場合はfalse
   */
  isPerformance: boolean;

  /**
   * 譜面のブロックの集合
   */
  blocks: Block[];
};
