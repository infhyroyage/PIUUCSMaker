import { MouseDown, Note } from "./chart";
import { Indicator } from "./chart";

export type BlockControllerButtonProps = {
  /**
   * 譜面のブロックの高さ(px単位)
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

export type BlockControllerMenuProps = {
  /**
   * 譜面のブロックが1個しか存在しない場合はtrue、2個以上の場合はfalse
   */
  isDisabledDelete: boolean;

  /**
   * メニュー選択時の動作
   */
  handler: BlockControllerMenuHandler;
};

export type BorderLineProps = {
  /**
   * 高さ(px単位)
   */
  height: number | string;

  /**
   * 幅(px単位)
   */
  width: number | string;
};

type ChartIndicatorMenuHandler = {
  /**
   * Split Block」選択時の動作
   * @param {Indicator} indicator インディケーターの表示パラメーター(インディケーター非表示の場合はnull)
   * @returns
   */
  split: (indicator: Indicator) => void;
};

/**
 * ChartIndicatorのprops
 */
export type ChartIndicatorProps = {
  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * メニュー選択時の動作
   */
  handler: ChartIndicatorMenuHandler;

  /**
   * インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;

  /**
   * マウス押下時のパラメーター
   * マウス押下していない場合はnull
   */
  mouseDown: MouseDown;
};

/**
 * ChartIndicatorMenuのprops
 */
export type ChartIndicatorMenuProps = {
  /**
   * メニュー選択時の動作
   */
  handler: ChartIndicatorMenuHandler;

  /**
   * 列インデックスcolumnにおける、インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;
};

/**
 * ChartVerticalのprops
 */
export type ChartVerticalProps = {
  /**
   * 各譜面のブロックを設置するトップバーからのy座標の距離(px単位)
   */
  blockYDists: number[];

  /**
   * 列インデックス
   * Single/SinglePerformance譜面の場合は0〜4、Double/DoublePerformance譜面の場合は0〜9
   */
  column: number;

  /**
   * 列インデックスcolumnにおける、インディケーターの表示パラメーター
   * インディケーター非表示の場合はnull
   */
  indicator: Indicator;

  /**
   * 列インデックスcolumnにおける、マウス押下時のパラメーター
   * マウス押下していない場合はnull
   */
  mouseDown: MouseDown;

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
   * 譜面のブロックのBeat値
   */
  beat: number;

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
  length: number;

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
  accumulatedLength: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロックを設置するトップバーからのy座標の距離(px単位)
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
  idx: number;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点が属する譜面のブロックのSplit値
   */
  split: number;

  /**
   * 単ノートの場合はX、ホールドの始点の場合はM、ホールドの中間の場合はH、ホールドの終点の場合はW
   */
  type: "X" | "M" | "H" | "W";
};

export type RectangleBlockIdentifierProps = {
  /**
   * 譜面のブロックのBeat値
   */
  beat: number;

  /**
   * 譜面のブロックのインデックス
   */
  blockIdx: number;

  /**
   * 全譜面のブロックのうち自身が最後の場合はtrue、そうでない場合はfalse
   */
  isLastBlock: boolean;

  /**
   * 譜面のブロックの行数
   */
  length: number;

  /**
   * 譜面のブロックのSplit値
   */
  split: number;
};
