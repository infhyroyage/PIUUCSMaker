/**
 * アップロードしたファイル名
 */
export type FileNames = {
  /**
   * mp3ファイル名(拡張子込)
   * 未アップロード時はundefined
   */
  mp3?: string;

  /**
   * ucsファイル名(拡張子込)
   * 未アップロード時はundefined
   */
  ucs?: string;
};

/**
 * インディケーターの表示パラメーター
 * インディケーター非表示の場合はnull
 */
export type Indicator = null | {
  /**
   * インディケーターの示す譜面のブロックのインデックス
   */
  blockIdx: number;

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
   * マウス押下時の譜面全体での行のインデックス
   */
  rowIdx: number;

  /**
   * マウス押下時の行のtop値
   */
  top: number;
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
