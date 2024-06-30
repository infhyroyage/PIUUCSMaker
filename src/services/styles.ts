/**
 * z-index of DarkBackground
 */
export const DARK_BACKGROUND_Z_INDEX: number = 1200000;

/**
 * Width (px) of Identifier
 */
export const IDENTIFIER_WIDTH: number = 36;

/**
 * Height (px) of MenuBar which corresponds to the wiidth (px) of closed MenuDrawer
 */
export const MENU_BAR_HEIGHT: number = 48;

/**
 * z-index of MenuBar
 */
export const MENU_BAR_Z_INDEX: number = 1100000;

/**
 * Width (px) of opened MenuDrawer
 */
export const MENU_DRAWER_OPENED_WIDTH: number = 180;

/**
 * z-index of MenuDrawer
 */
export const MENU_DRAWER_Z_INDEX: number = 1000000;

/**
 * z-index of BlockControllerMenu and ChartIndicatorMenu
 */
export const MENU_Z_INDEX: number = 1300000;

/**
 * Default z-index scale in MUI
 * @link https://mui.com/material-ui/customization/z-index
 * TODO: 1000倍して消す
 */
export const MUI_DEFAULT_Z_INDEX: Record<string, number> = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

/**
 * z-index of SuccessSnackbar and UserErrorSnackbar
 */
export const SNACKBAR_Z_INDEX: number = 1400000;
