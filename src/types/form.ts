import { Block, Note } from "./chart";

export type EditBlockDialogError = "bpm" | "delay" | "beat" | "split";

export type EditBlockDialogForm = {
  beat: string;
  blockIdx: number;
  bpm: string;
  delay: string;
  open: boolean;
  split: string;
};

export type NewUCSDialogErrors =
  | "ucsName"
  | "mode"
  | "bpm"
  | "delay"
  | "beat"
  | "split"
  | "rowLength";

export type NewUCSDialogForm = {
  beat: string;
  bpm: string;
  delay: string;
  ucsName: string;
  mode: string;
  rowLength: string;
  split: string;
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
