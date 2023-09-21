import { Block, Note } from "./ucs";

export type NewFileDialogErrors =
  | "fileName"
  | "mode"
  | "bpm"
  | "delay"
  | "beat"
  | "split"
  | "rowLength";

export type NewFileDialogForm = {
  beat: string;
  bpm: string;
  delay: string;
  fileName: string;
  mode: string;
  rowLength: string;
  split: string;
};

export type NewFileValidation = {
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
