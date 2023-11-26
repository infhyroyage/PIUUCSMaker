import { Block, Note } from "./ucs";

/**
 * Form of AdjustBlockDialog
 */
export type AdjustBlockDialogForm = {
  /**
   * BPM
   */
  bpm: number;

  /**
   * A number of rows
   */
  rows: number;

  /**
   * Split
   */
  split: number;
};

/**
 * Fixed name of only one in the form of AdjustBlockDialog
 */
export type AdjustBlockDialogFormFixed = "bpm" | "rows" | "split";

/**
 * Label with validation error in EditBlockDialog
 */
export type EditBlockDialogError =
  | "Beat"
  | "BPM"
  | "Delay(ms)"
  | "Rows"
  | "Split";

/**
 * Form of EditBlockDialog
 */
export type EditBlockDialogForm = {
  /**
   * String of Beat
   */
  beat: string;

  /**
   * String of BPM
   */
  bpm: string;

  /**
   * String of delay
   */
  delay: string;

  /**
   * String of a number of rows
   */
  rows: string;

  /**
   * String of split
   */
  split: string;
};

/**
 * Label with validation error in NewUCSDialog
 */
export type NewUCSDialogError =
  | "Beat"
  | "BPM"
  | "Delay(ms)"
  | "Rows"
  | "Split"
  | "UCS File Name";

/**
 * Form of NewUCSDialog
 */
export type NewUCSDialogForm = {
  /**
   * String of beat
   */
  beat: string;

  /**
   * String of BPM
   */
  bpm: string;

  /**
   * String of delay
   */
  delay: string;

  /**
   * Chart mode indicated as following strings:
   * * Single
   * * SinglePerformance
   * * Double
   * * DoublePerformance
   */
  mode: string;

  /**
   * String of a number of rows
   */
  rows: string;

  /**
   * String of split
   */
  split: string;

  /**
   * UCS file name except a extension
   */
  ucsName: string;
};

/**
 * Validation value in useUploadingUCS
 */
export type UploadingUCSValidation = {
  /**
   * A set of chart block
   */
  blocks: Block[];

  /**
   * Error message of validation check
   * null if validation check is valid
   */
  errMsg: string | null;

  /**
   * true if chart is single performance or double performance,
   * false if chart is single or double
   */
  isPerformance: boolean;

  /**
   * A set of single note, starting point of hold, setting point of hold or end point of hold,
   * whose the first index matches the number of columns (5 if chart is single or single performance, 10 if chart is double or double performance)
   */
  notes: Note[][];
};
