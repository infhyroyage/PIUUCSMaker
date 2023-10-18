import { Note } from "./chart";
import { Indicator, SelectorCords } from "./ui";

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

type BlockControllerMenuHandler = {
  /**
   * 「Add at Bottom」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  add: (blockIdx: number) => void;

  /**
   * 「Delete」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  delete: (blockIdx: number) => void;

  /**
   * 「Edit」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  edit: (blockIdx: number) => void;

  /**
   * 「Insert into Next」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  insert: (blockIdx: number) => void;

  /**
   * 「Merge with Above」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  mergeAbove: (blockIdx: number) => void;

  /**
   * 「Merge with Below」選択時の動作
   * @param {number} blockIdx 譜面のブロックのインデックス
   * @returns
   */
  mergeBelow: (blockIdx: number) => void;
};

/**
 * BlockControllerMenuのprops
 */
export type BlockControllerMenuProps = {
  /**
   * 譜面のブロックの個数
   */
  blockNum: number;

  /**
   * メニュー選択時の動作
   */
  handler: BlockControllerMenuHandler;
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

type ChartIndicatorMenuHandler = {
  /**
   * 「Start Setting Hold」選択時の動作
   * @returns
   */
  setHold: () => void;

  /**
   * 「Start Selecting」選択時の動作
   * @returns
   */
  setSelector: () => void;

  /**
   * 「Split Block」選択時の動作
   * @returns
   */
  split: () => void;
};

/**
 * ChartIndicatorMenuのprops
 */
export type ChartIndicatorMenuProps = {
  /**
   * メニュー選択時の動作
   */
  handler: ChartIndicatorMenuHandler;
};

/**
 * ChartSelectorのprops
 */
export type ChartSelectorProps = {
  /**
   * 選択領域の入力開始時、および、入力時/入力終了時のマウスの各座標を構成するパラメーター
   */
  cords: SelectorCords;
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
