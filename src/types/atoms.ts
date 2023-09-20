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
