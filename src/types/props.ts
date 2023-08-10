import { Chart } from "./ucs";

export type ChartBlockProps = {
  chartLength: 5 | 10;
  blockLength: number;
};

export type ChartBlockRectangleProps = {
  blockLength: number;
};

export type MenuDrawerProps = {
  isOpenedDrawer: boolean;
};

export type UploadRequestProps = {
  setChart: React.Dispatch<React.SetStateAction<Chart | undefined>>;
};
