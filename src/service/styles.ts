/**
 * Identifierの幅(px単位)
 */
export const IDENTIFIER_WIDTH: number = 40;

/**
 * MenuBarの高さ、および、展開していないMenuDrawerの横幅(px単位)
 */
export const MENU_BAR_HEIGHT: number = 48;

/**
 * 展開したMenuDrawerの横幅(px単位)
 */
export const MENU_DRAWER_OPENED_WIDTH = 200;

/**
 * MUIコンポーネントのz-indexのデフォルト値
 * @link https://mui.com/material-ui/customization/z-index
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
