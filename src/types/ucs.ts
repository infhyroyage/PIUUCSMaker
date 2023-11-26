/**
 * Chart block
 */
export type Block = {
  /**
   * Total numbers of rows in each chart block before this one
   * 0 if this chart block is first
   */
  accumulatedRows: number;

  /**
   * Beat
   */
  beat: number;

  /**
   * BPM
   */
  bpm: number;

  /**
   * Delay(ms)
   */
  delay: number;

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
 * Snapshot just before editing of the chart block, single note, starting point of hold, setting point of hold or end point of hold
 */
export type ChartSnapshot = {
  /**
   * State managed by blocksState just before editing
   * null if there is no difference between before and after editing
   */
  blocks: Block[] | null;

  /**
   * State managed by notesState just before editing
   * null if there is no difference between before and after editing
   */
  notes: Note[][] | null;
};

/**
 * Clipboard to copy and paste a set of single note, starting point of hold, setting point of hold or end point of hold included in the selection area
 * null if nothing has ever been copied
 */
export type ClipBoard = null | {
  /**
   * Length of column of the selection area when copying
   */
  columnLength: number;

  /**
   * A set of single note, starting point of hold, setting point of hold or end point of hold
   */
  copiedNotes: CopiedNote[];

  /**
   * Length of row of the selection area when copying
   */
  rowLength: number;
};

/**
 * Single note, starting point of hold, setting point of hold or end point of hold when copying
 */
export type CopiedNote = {
  /**
   * Increment of column index at top left of the selection area when copying
   */
  deltaColumn: number;

  /**
   * Increment of row index in the entire chart at top left of the selection area when copying
   */
  deltaRowIdx: number;

  /**
   * X for a single note,
   * M for a starting point of hold,
   * H for a setting point of hold,
   * W for an end point of hold
   */
  type: "X" | "M" | "H" | "W";
};

/**
 * Single note, starting point of hold, setting point of hold or end point of hold
 */
export type Note = {
  /**
   * Row index in the entire chart
   */
  rowIdx: number;

  /**
   * X for a single note,
   * M for a starting point of hold,
   * H for a setting point of hold,
   * W for an end point of hold
   */
  type: "X" | "M" | "H" | "W";
};
