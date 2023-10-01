/**
 * 譜面のブロック
 */
export type Block = {
  /**
   * 以前までの譜面のブロックの行数の総和
   * 0番目の譜面のブロックの場合は0
   */
  accumulatedLength: number;

  /**
   * Beat値
   * 1〜64が有効範囲
   */
  beat: number;

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
   * 行数
   */
  length: number;

  /**
   * Split値
   * 1〜128が有効範囲
   */
  split: number;
};

/**
 * コピー時の単ノート/ホールドの始点/ホールドの中間/ホールドの終点
 */
export type CopiedNote = {
  /**
   * コピー時の選択領域の左上からの列インデックスの増分
   */
  deltaColumn: number;

  /**
   * コピー時の選択領域の左上からの譜面全体での行インデックスの増分
   */
  deltaRowIdx: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";
};

/**
 * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点
 */
export type Note = {
  /**
   * 譜面全体での行インデックス
   */
  idx: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";
};
