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
  blockLength: number;
  noteSize: number;
  borderSize: number;
  accumulatedBlockLength: number;
  split: number;
  notes: Note[];
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};
