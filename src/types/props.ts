import { MouseEvent } from "react";
import { Note } from "./ucs";

/**
 * Props of BlockControllerButton
 */
export type BlockControllerButtonProps = {
  /**
   * BPM of this chart block
   */
  bpm: number;

  /**
   * Delay(ms) of this chart block
   */
  delay: number;

  /**
   * true if this chart block is first, otherwise false
   */
  isFirstBlock: boolean;

  /**
   * true if this chart block is last, otherwise false
   */
  isLastBlock: boolean;

  onClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;

  /**
   * A number of rows of this chart block
   */
  rows: number;

  /**
   * Split of this chart block
   */
  split: number;
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
 * Props of ChartVertical
 */
export type ChartVerticalProps = {
  /**
   * Distances (px) of y-coordinate between NavigationBar and each chart block
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
   * Distance (px) of y-coordinate between NavigationBar and chart block included this single note, starting point of hold, setting point of hold or end point of hold
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
 * Props of DrawerListItem
 */
export type DrawerListItemProps = {
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
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Props of DrawerUploadListItem
 */
export type DrawerUploadListItemProps = {
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

/**
 * Props of MenuBackground
 */
export type MenuBackgroundProps = {
  /**
   * Action when clicking background
   */
  onClose: () => void;
};

/**
 * Props of MenuItem
 */
export type MenuItemProps = {
  /**
   * true if item is inactive, false if one is active
   */
  disabled?: boolean;

  /**
   * Label of keyboard shortcut
   */
  keyLabel?: string;

  /**
   * Label
   */
  label: string;

  /**
   * Action when clicking a item
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
