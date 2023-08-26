export type ChartBorderLineProps = {
  height: string;
  width: string;
};

export type ChartVerticalRectanglesProps = {
  borderSize: number;
  column: number;
  noteSize: number;
};

export type ChartRectangleProps = {
  blockIdx: number;
  height: number;
};

export type MenuBarProps = {
  isDarkMode: boolean;
  isOpenedDrawer: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenedDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};
