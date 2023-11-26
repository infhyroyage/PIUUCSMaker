/**
 * Display parameter when setting a hold
 * null if not setting a hold
 */
export type HoldSetter = null | {
  /**
   * Column index at the starting point of hold setting
   */
  column: number;

  /**
   * true if starting to set a hold from "Starting Setting Hold" of ChartIndicatorMenu,
   * otherwise false
   */
  isSettingByMenu: boolean;

  /**
   * Row index in the entire chart at the starting point of hold setting
   */
  rowIdx: number;

  /**
   * Top (px) at the row of the starting point of hold setting
   */
  top: number;
};

/**
 * Display parameter of indicator
 * null if the indicator is not displayed
 */
export type Indicator = null | {
  /**
   * Total numbers of rows in each chart block before the one indicated by the indicator
   */
  blockAccumulatedRows: number;

  /**
   * Index of the chart block indicated by the indicator
   */
  blockIdx: number;

  /**
   * Column index indicated by the indicator
   */
  column: number;

  /**
   * Row index in the entire chart indicated by the indicator
   */
  rowIdx: number;

  /**
   * Top (px) of the indicator
   */
  top: number;
};

/**
 * Display parameter of the selection area
 */
export type Selector = {
  /**
   * Coordinates after inputting the selection area
   * null if the selection area is not inputted or inputting
   */
  completed: null | SelectorCompletedCords;

  /**
   * true if inputting the selection area from "Starting Selecting" of ChartIndicatorMenu,
   * otherwise false
   */
  isSettingByMenu: boolean;

  /**
   * Coordinates at the beginning and during input of the selection area
   * null if the selection area is not inputted or already inputted
   */
  setting: null | SelectorSettingCords;
};

/**
 * Coordinates after inputting the selection area
 */
export type SelectorCompletedCords = {
  /**
   * Column index at the bottom right of the selection area
   */
  goalColumn: number;

  /**
   * Row index in the entire chart at the bottom right of the selection area
   */
  goalRowIdx: number;

  /**
   * Column index at the top left of the selection area
   */
  startColumn: number;

  /**
   * Row index in the entire chart at the top left of the selection area
   */
  startRowIdx: number;
};

/**
 * Coordinates at the beginning and during input of the selection area
 */
export type SelectorSettingCords = {
  /**
   * Column index at the beginning input of selection area
   */
  mouseDownColumn: number;

  /**
   * Row index in the entire chart at the beginning input of selection area
   */
  mouseDownRowIdx: number;

  /**
   * Column index during input of the selection area
   * null if the mouse coordinate is out of the chart during input of the selection area
   */
  mouseUpColumn: number | null;

  /**
   * Row index in the entire chart during input of the selection area
   * null if the mouse coordinate is out of the chart during input of the selection area
   */
  mouseUpRowIdx: number | null;
};
