import { Note } from "./ucs";

/**
 * BlockControllerButtonのprops
 */
export type BlockControllerButtonProps = {
  /**
   * 譜面のブロックの高さ(px)
   */
  blockHeight: number;

  /**
   * 譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * 全譜面のブロックのうち自身が最後の場合はtrue、そうでない場合はfalse
   */
  isLastBlock: boolean;

  /**
   * ボタンのテキスト(1段落目)
   */
  textFirst: string;

  /**
   * ボタンのテキスト(2段落目)
   */
  textSecond: string;
};

/**
 * BorderLineのprops
 */
export type BorderLineProps = {
  /**
   * インラインスタイル
   */
  style?: React.CSSProperties;
};

/**
 * ChartSelectorのprops
 */
export type ChartSelectorProps = {
  /**
   * 選択領域の右下の列インデックス
   */
  goalColumn: number;

  /**
   * 選択領域の右下の譜面全体での行インデックス
   */
  goalRowIdx: number;

  /**
   * 選択領域の左上の列インデックス
   */
  startColumn: number;

  /**
   * 選択領域の左上の譜面全体での行インデックス
   */
  startRowIdx: number;
};

/**
 * ChartVerticalのprops
 */
export type ChartVerticalProps = {
  /**
   * 各譜面のブロックを設置するトップバーからのy座標の距離(px)
   */
  blockYDists: number[];

  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 列インデックスcolumnにおける、単ノート/ホールドの始点/ホールドの中間/ホールドの終点の集合
   */
  notes: Note[];
};

/**
 * ChartVerticalRectanglesのprops
 */
export type ChartVerticalRectanglesProps = {
  /**
   * 全譜面のブロックのうち自身が偶数番目の場合はtrue、奇数番目の場合はfalse
   */
  isEven: boolean;

  /**
   * 全譜面のブロックのうち自身が最後の場合はtrue、そうでない場合はfalse
   */
  isLastBlock: boolean;

  /**
   * 譜面のブロックの行数
   */
  rows: number;

  /**
   * 譜面のブロックのSplit値
   */
  split: number;
};

/**
 * ChartVerticalNoteImagesのprops
 */
export type ChartVerticalNoteImagesProps = {
  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロック以前までの譜面のブロックの行数の総和
   */
  accumulatedRows: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロックを設置するトップバーからのy座標の距離(px)
   */
  blockYDist: number;

  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の譜面全体での行インデックス
   */
  rowIdx: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロックのSplit値
   */
  split: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";
};

/**
 * MenuDrawerListItemのprops
 */
export type MenuDrawerListItemProps = {
  /**
   * 無効化する場合はtrue、そうでない場合はfalse
   */
  disabled?: boolean;

  /**
   * アイコンのコンポーネント
   */
  icon: React.ReactNode;

  /**
   * ラベル
   */
  label: string;

  /**
   * 押下時の動作
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

/**
 * MenuDrawerUploadListItemのprops
 */
export type MenuDrawerUploadListItemProps = {
  /**
   * 無効化する場合はtrue、そうでない場合はfalse
   */
  disabled?: boolean;

  /**
   * inputタグのacceptに設定するアップロードに有効な拡張子(冒頭に.を入れること)
   */
  extension?: string;

  /**
   * アイコンのコンポーネント
   */
  icon: React.ReactNode;

  /**
   * inputタグのidに設定するid名
   */
  id: string;

  /**
   * ラベル
   */
  label: string;

  /**
   * 押下時の動作
   */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};
