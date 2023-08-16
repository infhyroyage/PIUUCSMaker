import { Note } from "./ucs";

export type ChartBlockProps = {
  chartLength: 5 | 10;
  isEvenIdx: boolean;
  blockLength: number;
  accumulatedBlockLength: number;
  split: number;
  notes: Note[][];
};

export type ChartBlockRectangleProps = {
  column: number;
  isEvenIdx: boolean;
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
