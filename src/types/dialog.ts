import { Block, Note } from "./chart";

export type EditBlockDialogError = "beat" | "bpm" | "delay" | "rows" | "split";

export type AdjustBlockDialogForm = {
  bpm: number;
  rows: number;
  split: number;
};

export type AdjustBlockDialogOpen = {
  fixed: "bpm" | "rows" | "split";
  open: boolean;
};

export type EditBlockDialogForm = {
  beat: string;
  blockIdx: number;
  bpm: string;
  delay: string;
  open: boolean;
  rows: string;
  split: string;
};

export type NewUCSDialogErrors =
  | "beat"
  | "bpm"
  | "delay"
  | "mode"
  | "rows"
  | "split"
  | "ucsName";

export type NewUCSDialogForm = {
  beat: string;
  bpm: string;
  delay: string;
  mode: string;
  rows: string;
  split: string;
  ucsName: string;
};

export type NewUCSValidation = {
  block: Block;
  columns: 5 | 10;
  isPerformance: boolean;
};

export type UploadingUCSValidation = {
  blocks: Block[];
  columns: 5 | 10;
  isPerformance: boolean;
  notes: Note[][];
};
