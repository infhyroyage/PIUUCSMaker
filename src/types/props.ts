import { Note } from "./ucs";

export type ChartBlockProps = {
  chartLength: 5 | 10;
  blockIdx: number;
  blockLength: number;
  accumulatedBlockLength: number;
  split: number;
  notes: Note[][];
};

export type ChartBlockRectangleProps = {
  column: number;
  blockIdx: number;
  blockHeight: number;
  noteSize: number;
  borderSize: number;
  accumulatedBlockLength: number;
  split: number;
  notes: Note[];
};

export type ChartBorderLineProps = {
  style: React.CSSProperties;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};
