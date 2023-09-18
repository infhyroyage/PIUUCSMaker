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
