import { Block, ChartSnapshot, Note } from "./ucs";

import { Selector } from "./chart";

import { Indicator } from "./chart";

import { HoldSetter } from "./chart";
import {
  BlockControllerMenuPosition,
  ChartIndicatorMenuPosition,
  Zoom,
} from "./menu";
import { ClipBoard } from "./ucs";

/**
 * Zustand store
 */
export type Store = {
  /**
   * Index of the block opening BlockControllerMenu
   * null if BlockControllerMenu is invisible
   */
  blockControllerMenuBlockIdx: number | null;

  /**
   * Setter for blockControllerMenuBlockIdx
   */
  setBlockControllerMenuBlockIdx: (
    blockControllerMenuBlockIdx: number | null
  ) => void;

  /**
   * Reset blockControllerMenuBlockIdx
   */
  resetBlockControllerMenuBlockIdx: () => void;

  /**
   * Coordinate of the browser screen opening BlockControllerMenu
   * undefined if BlockControllerMenu is invisible
   */
  blockControllerMenuPosition: BlockControllerMenuPosition | undefined;

  /**
   * Setter for blockControllerMenuPosition
   */
  setBlockControllerMenuPosition: (
    blockControllerMenuPosition: BlockControllerMenuPosition
  ) => void;

  /**
   * Reset blockControllerMenuPosition
   */
  resetBlockControllerMenuPosition: () => void;

  /**
   * A set of chart block
   */
  blocks: Block[];

  /**
   * Setter for blocks
   */
  setBlocks: (blocks: Block[]) => void;

  /**
   * Coordinate of the browser screen opening ChartIndicatorMenu
   * undefined if ChartIndicatorMenu is invisible
   */
  chartIndicatorMenuPosition: ChartIndicatorMenuPosition | undefined;

  /**
   * Setter for chartIndicatorMenuPosition
   */
  setChartIndicatorMenuPosition: (
    chartIndicatorMenuPosition: ChartIndicatorMenuPosition
  ) => void;

  /**
   * Reset chartIndicatorMenuPosition
   */
  resetChartIndicatorMenuPosition: () => void;

  /**
   * Clipboard to copy and paste a set of single note, starting point of hold, setting point of hold or end point of hold included in the selection area
   * null if nothing has ever been copied
   */
  clipBoard: ClipBoard | null;

  /**
   * Setter for clipBoard
   */
  setClipBoard: (clipBoard: ClipBoard | null) => void;

  /**
   * Display parameter when setting a hold
   * null if not setting a hold
   */
  holdSetter: HoldSetter | null;

  /**
   * Setter for holdSetter
   */
  setHoldSetter: (holdSetter: HoldSetter | null) => void;

  /**
   * Reset holdSetter
   */
  resetHoldSetter: () => void;

  /**
   * Display parameter of indicator
   * null if the indicator is not displayed
   */
  indicator: Indicator;

  /**
   * Setter for indicator
   */
  setIndicator: (indicator: Indicator) => void;

  /**
   * Reset indicator
   */
  resetIndicator: () => void;

  /**
   * true for dark mode, false for light mode
   */
  isDarkMode: boolean;

  /**
   * Toggle isDarkMode
   */
  toggleIsDarkMode: () => void;

  /**
   * true if beat sound is mute, otherwise false
   */
  isMuteBeats: boolean;

  /**
   * Toggle isMuteBeats
   */
  toggleIsMuteBeats: () => void;

  /**
   * true if chart is single performance or double performance,
   * false if chart is single or double
   */
  isPerformance: boolean;

  /**
   * Setter for isPerformance
   */
  setIsPerformance: (isPerformance: boolean) => void;

  /**
   * true if playing the chart, otherwise false
   */
  isPlaying: boolean;

  /**
   * Setter for isPlaying
   */
  setIsPlaying: (isPlaying: boolean) => void;

  /**
   * true to prevent exit during editing, otherwise false
   */
  isProtected: boolean;

  /**
   * Setter for isProtected
   */
  setIsProtected: (isProtected: boolean) => void;

  /**
   * mp3NameState
   */
  mp3Name: string | null;

  /**
   * Setter for mp3Name
   */
  setMp3Name: (mp3Name: string | null) => void;

  /**
   * A set of single note, starting point of hold, setting point of hold or end point of hold,
   * whose the first index matches the number of columns (5 if chart is single or single performance, 10 if chart is double or double performance)
   */
  notes: Note[][];

  /**
   * Setter for notes
   */
  setNotes: (notes: Note[][]) => void;

  /**
   * Width or height (px) of single note
   */
  noteSize: number;

  /**
   * Resize noteSize as follows with window size update
   * noteSize := min(window width, window height) / 15
   * However, noteSize is rounded down to the nearest integer, with a minimum value of 20
   */
  resizeNoteSizeWithWindow: () => void;

  /**
   * A stack of ChartSnapshot for redoing
   * Become past editing as increasing the index
   */
  redoSnapshots: ChartSnapshot[];

  /**
   * Push new ChartSnapshot for redoing
   */
  pushRedoSnapshot: (redoSnapshot: ChartSnapshot) => void;

  /**
   * Pop last ChartSnapshot for redoing
   */
  popRedoSnapshot: () => ChartSnapshot;

  /**
   * Reset redoSnapshots
   */
  resetRedoSnapshots: () => void;

  /**
   * Display parameter of the selection area
   */
  selector: Selector;

  /**
   * Setter for selector
   */
  setSelector: (selector: Selector) => void;

  /**
   * Hide selection area
   */
  hideSelector: () => void;

  /**
   * Success message
   */
  successMessage: string;

  /**
   * Setter for successMessage
   */
  setSuccessMessage: (successMessage: string) => void;

  /**
   * UCS file name included a extension
   * numm if nothing is uploaded
   */
  ucsName: string | null;

  /**
   * Setter for ucsName
   */
  setUcsName: (ucsName: string | null) => void;

  /**
   * A stack of ChartSnapshot for undoing
   * Become recent editing as increasing the index
   */
  undoSnapshots: ChartSnapshot[];

  /**
   * Push new ChartSnapshot for undoing
   */
  pushUndoSnapshot: (undoSnapshot: ChartSnapshot) => void;

  /**
   * Pop last ChartSnapshot for undoing
   */
  popUndoSnapshot: () => ChartSnapshot;

  /**
   * Reset undoSnapshots
   */
  resetUndoSnapshots: () => void;

  /**
   * Message displayed UserErrorSnackbar
   */
  userErrorMessage: string;

  /**
   * Setter for userErrorMessage
   */
  setUserErrorMessage: (userErrorMessage: string) => void;

  /**
   * Volume value
   * 0 for mute, 1 for max
   */
  volumeValue: number;

  /**
   * Setter for volumeValue
   */
  setVolumeValue: (volumeValue: number) => void;

  /**
   * Display parameter for zooming in or out
   */
  zoom: Zoom;

  /**
   * Update zoom from idx
   */
  updateZoomFromIdx: (updatedIdx: number) => void;
};
