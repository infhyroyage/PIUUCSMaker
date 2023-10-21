/**
 * 譜面のブロック
 */
export type Block = {
  /**
   * 以前までの譜面のブロックの行数の総和
   * 0番目の譜面のブロックの場合は0
   */
  accumulatedRows: number;

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
  rows: number;

  /**
   * Split値
   * 1〜128が有効範囲
   */
  split: number;
};

/**
 * 譜面のブロック/単ノート/ホールドの始点/ホールドの中間/ホールドの終点の編集直前のスナップショット
 */
export type ChartSnapshot = {
  /**
   * 編集直前のblocksStateで管理する値(Block[])
   * 編集前後で変更しない場合はnull
   */
  blocks: Block[] | null;

  /**
   * 編集直前のnotesStateで管理する値(Note[][])
   * 編集前後で変更しない場合はnull
   */
  notes: Note[][] | null;
};

/**
 * 選択領域に含まれるCopiedNoteの集合をコピーできるクリップボード
 * 1度もコピーしていない場合はnull
 */
export type ClipBoard = null | {
  /**
   * コピー時の選択領域の列の長さ
   */
  columnLength: number;

  /**
   * CopiedNoteの集合
   */
  copiedNotes: CopiedNote[];

  /**
   * コピー時の選択領域の行の長さ
   */
  rowLength: number;
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
  rowIdx: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";
};
