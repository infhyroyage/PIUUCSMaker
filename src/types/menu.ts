import { PopoverPosition } from "@mui/material";

/**
 * Coordinate of the browser screen opening BlockControllerMenu
 * undefined if BlockControllerMenu is invisible
 */
export type BlockControllerMenuPosition = PopoverPosition | undefined;

/**
 * Coordinate of the browser screen opening ChartIndicatorMenu
 * undefined if ChartIndicatorMenu is invisible
 */
export type ChartIndicatorMenuPosition = PopoverPosition | undefined;

/**
 * Display parameter when zooming in or out
 */
export type Zoom = {
  /**
   * ZOOM_VALUES index
   */
  idx: number;

  /**
   * y-coordinate of the browser screen just after zooming in or out
   * null if nothing has ever been zoomed in or out
   */
  top: number | null;
};
