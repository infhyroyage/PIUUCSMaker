/**
 * 単ノート/ホールド
 */
export type Note = {
  /**
   * 単ノート/ホールドの列インデックス
   * Single譜面の場合は左下から0〜4、Double譜面の場合は1P左下から0〜9
   */
  column: number;

  /**
   * 単ノート/ホールドの始点の行インデックス
   * 単ノートの場合はgoalと同じ値
   */
  start: number;

  /**
   * 単ノート/ホールドの終点の行インデックス
   * 単ノートの場合はstartと同じ値
   */
  goal: number;

  /**
   * 中抜きホールドの中間にかぶせる始点の行インデックスの配列
   * 単ノート/中抜きの無いホールドの場合は要素数0の配列
   */
  hollowStarts: number[];

  /**
   * 中抜きホールドの中間にかぶせる終点の行インデックスの配列
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
   * 有効数字7桁までの-999999~999999が有効範囲
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

  /**
   * 単ノート/ホールドの集合
   */
  notes: Note[];
};
