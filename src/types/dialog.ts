import { Block, Note } from "./ucs";

/**
 * AdjustBlockDialogの入力フォーム
 */
export type AdjustBlockDialogForm = {
  /**
   * BPM値
   */
  bpm: number;

  /**
   * 行数
   */
  rows: number;

  /**
   * Split値
   */
  split: number;
};

/**
 * AdjustBlockDialogの入力フォームで1つだけ固定するパラメーター名
 */
export type AdjustBlockDialogFormFixed = "bpm" | "rows" | "split";

/**
 * EditBlockDialogでバリデーションエラーが発生したテキストボックスのラベル
 */
export type EditBlockDialogError =
  | "Beat"
  | "BPM"
  | "Delay(ms)"
  | "Rows"
  | "Split";

/**
 * EditBlockDialogの入力フォーム
 */
export type EditBlockDialogForm = {
  /**
   * Beat値の文字列
   */
  beat: string;

  /**
   * BPM値の文字列
   */
  bpm: string;

  /**
   * Delay値の文字列
   */
  delay: string;

  /**
   * 行数の文字列
   */
  rows: string;

  /**
   * Split値の文字列
   */
  split: string;
};

/**
 * EditBlockDialogでのバリデーション値
 */
export type EditBlockDialogValidation = {
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
   * バリデーションエラー時のエラーメッセージ
   * バリデーションエラーでない場合は空配列
   */
  errors: EditBlockDialogError[];

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
 * NewUCSDialogでバリデーションエラーが発生したテキストボックスのラベル
 */
export type NewUCSDialogError =
  | "Beat"
  | "BPM"
  | "Delay(ms)"
  | "Rows"
  | "Split"
  | "UCS File Name";

/**
 * NewUCSDialogの入力フォーム
 */
export type NewUCSDialogForm = {
  /**
   * Beat値の文字列
   */
  beat: string;

  /**
   * BPM値の文字列
   */
  bpm: string;

  /**
   * Delay値の文字列
   */
  delay: string;

  /**
   * 以下のいずれかの文字列で表現する、譜面のモード
   * * Single
   * * SinglePerformance
   * * Double
   * * DoublePerformance
   */
  mode: string;

  /**
   * 行数の文字列
   */
  rows: string;

  /**
   * Split値の文字列
   */
  split: string;

  /**
   * ucsファイル名(拡張子抜き)
   */
  ucsName: string;
};

/**
 * NewUCSDialogでのバリデーション値
 */
export type NewUCSDialogValidation = {
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
   * バリデーションエラー時のエラーメッセージ
   * バリデーションエラーでない場合は空配列
   */
  errors: NewUCSDialogError[];

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
 * useUploadingUCSでのバリデーション値
 */
export type UploadingUCSValidation = {
  /**
   * 譜面のブロックの集合
   */
  blocks: Block[];

  /**
   * バリデーションエラー時のエラーメッセージ
   * バリデーションエラーでない場合はnull
   */
  errMsg: string | null;

  /**
   * SinglePerformance/DoublePerformance譜面の場合はtrue、Single/Double譜面の場合はfalse
   */
  isPerformance: boolean;

  /**
   * 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の集合
   * 第1インデックスの要素数は列数(Single/SinglePerformance譜面の場合は5、Double/DoublePerformance譜面の場合は10)と一致
   */
  notes: Note[][];
};
