import { Note } from "./ucs";

/**
 * Props of BlockControllerButton
 */
export type BlockControllerButtonProps = {
  /**
   * Height (px) of chart block
   */
  blockHeight: number;

  /**
   * Index of chart block
   */
  blockIdx: number;

  /**
   * true if this chart block is last, otherwise false
   */
  isLastBlock: boolean;

  /**
   * First paragraph of text
   */
  textFirst: string;

  /**
   * Second paragraph of text
   */
  textSecond: string;
};

/**
 * Props of BorderLine
 */
export type BorderLineProps = {
  /**
   * Inline style
   */
  style?: React.CSSProperties;
};

/**
 * Props of ChartIndicatorMenuItem
 */
export type ChartIndicatorMenuItemProps = {
  /**
   * true if item is inactive, false if one is active
   */
  disabled?: boolean;

  /**
   * Label
   */
  label: string;

  /**
   * Label of keyboard shortcut
   */
  keyLabel?: string;

  /**
   * Action when clicking a item
   */
  onClick?: React.MouseEventHandler<HTMLLIElement>;
};

/**
 * Props of ChartVertical
 */
export type ChartVerticalProps = {
  /**
   * Distances (px) of y-coordinate between MenuBar and each chart block
   */
  blockYDists: number[];

  /**
   * Column index
   * 0, 1, ..., 4 if chart is single or single performance,
   * 0, 1, ..., 10 if chart is double or double performance
   */
  column: number;

  /**
   * A set of single note, starting point of hold, setting point of hold or end point of hold at column index
   */
  notes: Note[];
};

/**
 * Props of ChartVerticalRectangles
 */
export type ChartVerticalRectanglesProps = {
  /**
   * true if the index of this chart block is even, otherwise false
   */
  isEven: boolean;

  /**
   * true if this chart block is last, otherwise false
   */
  isLastBlock: boolean;

  /**
   * A number of rows of chart block
   */
  rows: number;

  /**
   * Split of chart block
   */
  split: number;
};

/**
 * Props of ChartVerticalNoteImages
 */
export type ChartVerticalNoteImagesProps = {
  /**
   * Total numbers of rows in each chart block before one included this single note, starting point of hold, setting point of hold or end point of hold
   */
  accumulatedRows: number;

  /**
   * Distance (px) of y-coordinate between MenuBar and chart block included this single note, starting point of hold, setting point of hold or end point of hold
   */
  blockYDist: number;

  /**
   * Column index
   * 0, 1, ..., 4 if chart is single or single performance,
   * 0, 1, ..., 10 if chart is double or double performance
   */
  column: number;

  /**
   * Row index in the entire chart
   */
  rowIdx: number;

  /**
   * Split of chart block included this single note, starting point of hold, setting point of hold or end point of hold
   */
  split: number;

  /**
   * X for a single note,
   * M for a starting point of hold,
   * H for a setting point of hold,
   * W for an end point of hold
   */
  type: "X" | "M" | "H" | "W";
};

/**
 * Props of MenuDrawerListItem
 */
export type MenuDrawerListItemProps = {
  /**
   * true if item is inactive, false if one is active
   */
  disabled?: boolean;

  /**
   * Icon component
   */
  icon: React.ReactNode;

  /**
   * Label
   */
  label: string;

  /**
   * Action when clicking a item
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

/**
 * Props of MenuDrawerUploadListItem
 */
export type MenuDrawerUploadListItemProps = {
  /**
   * true if item is inactive, false if one is active
   */
  disabled?: boolean;

  /**
   * Upload activated extension set at accept attribute of input DOM
   * Note that the prefix must be "."
   */
  extension?: string;

  /**
   * Icon component
   */
  icon: React.ReactNode;

  /**
   * ID set at id attribute of input DOM
   */
  id: string;

  /**
   * Label
   */
  label: string;

  /**
   * Action when clicking a item
   */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};
