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
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export type Indicator = null | {
  /**
   * インディケーターの示す譜面のブロックから以前までの譜面のブロックの行数の総和
   */
  blockAccumulatedLength: number;

  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * インディケーターの列インデックス
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
 * 譜面へのマウス押下時のパラメーター
 * 譜面にマウスを押下していない場合はnull
 */
export type MouseDown = null | {
  /**
   * マウス押下時の列インデックス
   */
  column: number;

  /**
   * マウス押下時の譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * マウス押下時の行のtop値
   */
  top: number;
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

/**
 * 選択領域のパラメーター
 * 選択領域非表示の場合はnull
 */
export type Selector = null | {
  /**
   * 選択領域の縦方向における終点の列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  goalColumn: number;

  /**
   * 選択領域の縦方向における終点の譜面全体での行インデックス
   */
  goalRowIdx: number;

  /**
   * 選択領域の終点のtop値
   */
  goalTop: number;

  /**
   * 選択領域の縦方向における始点の列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  startColumn: number;

  /**
   * 選択領域の縦方向における始点の譜面全体での行インデックス
   */
  startRowIdx: number;

  /**
   * 選択領域の始点のtop値
   */
  startTop: number;
};

/**
 * 拡大/縮小時のパラメーター
 */
export type Zoom = {
  /**
   * 現在の倍率の値のインデックス
   */
  idx: number;

  /**
   * 拡大/縮小直後のブラウザの画面のy座標
   * 1度も拡大/縮小していない場合はnull
   */
  top: number | null;
};
