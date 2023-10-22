import { Block, Note } from "./ucs";

export type AdjustBlockDialogForm = {
  bpm: number;
  rows: number;
  split: number;
};

export type AdjustBlockDialogOpen = {
  fixed: "bpm" | "rows" | "split";
  open: boolean;
};

export type EditBlockDialogError = "beat" | "bpm" | "delay" | "rows" | "split";

export type EditBlockDialogForm = {
  beat: string;
  blockIdx: number;
  bpm: string;
  delay: string;
  open: boolean;
  rows: string;
  split: string;
};

/**
 * NewUCSDialogでバリデーションエラーが発生したテキストボックス名
 */
export type NewUCSDialogError =
  | "beat"
  | "bpm"
  | "delay"
  | "mode"
  | "rows"
  | "split"
  | "ucsName";

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
 * NewUCSDialogでのバリデーションが通った入力値
 */
export type NewUCSValidation = {
  /**
   * 譜面のブロック
   */
  block: Block;

  /**
   * 列数 Single/SinglePerformance譜面の場合は5、Double/DoublePerformance譜面の場合は10
   */
  columns: 5 | 10;

  /**
   * SinglePerformance/DoublePerformance譜面の場合はtrue、Single/Double譜面の場合はfalse
   */
  isPerformance: boolean;
};

export type UploadingUCSValidation = {
  blocks: Block[];
  columns: 5 | 10;
  isPerformance: boolean;
  notes: Note[][];
};
