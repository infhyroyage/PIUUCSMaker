import { Chart } from "./ucs";

export type ChartBlockProps = {
  chartLength: 5 | 10;
  isEvenIdx: boolean;
  blockLength: number;
  split: number;
};

export type ChartBlockRectangleProps = {
  isEvenIdx: boolean;
  blockLength: number;
  split: number;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};

export type UploadRequestProps = {
  setChart: React.Dispatch<React.SetStateAction<Chart | undefined>>;
};
