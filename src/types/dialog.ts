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
