/**
 * ドロワーの展開状態に応じてドロワー内のListItemButtonのスタイルを生成する
 * @param {boolean} isOpenedMenuDrawer ドロワーを展開している場合はtrue、展開していない場合はfalse
 * @returns ドロワー内のListItemButtonのスタイル
 */
export const generateListItemButtonStyle = (isOpenedMenuDrawer: boolean) => {
  return {
    justifyContent: isOpenedMenuDrawer ? "initial" : "center",
    minHeight: 48,
    px: 2.5,
  };
};

/**
 * ドロワーの展開状態に応じてドロワー内のListItemIconのスタイルを生成する
 * @param {boolean} isOpenedMenuDrawer ドロワーを展開している場合はtrue、展開していない場合はfalse
 * @returns ドロワー内のListItemIconのスタイル
 */
export const generateListItemIconStyle = (isOpenedMenuDrawer: boolean) => {
  return {
    justifyContent: "center",
    minWidth: 0,
    mr: isOpenedMenuDrawer ? 3 : "auto",
  };
};

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
