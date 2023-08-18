export type ChartBlockProps = {
  blockIdx: number;
  chartLength: 5 | 10;
  blockLength: number;
  accumulatedBlockLength: number;
  split: number;
};

export type ChartBlockRectangleProps = {
  blockIdx: number;
  column: number;
  accumulatedBlockLength: number;
  split: number;
  blockHeight: number;
  noteSize: number;
  borderSize: number;
};

export type ChartBorderLineProps = {
  style: React.CSSProperties;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};
