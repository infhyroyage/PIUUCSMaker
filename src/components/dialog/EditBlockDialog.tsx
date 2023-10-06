import { useCallback, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  blocksState,
  editBlockDialogFormState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../service/atoms";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { EditBlockDialogError, EditBlockDialogForm } from "../../types/dialog";
import { Block, Note } from "../../types/chart";
import { ChartSnapshot } from "../../types/ui";

const validate = (form: EditBlockDialogForm): EditBlockDialogError | null => {
  // BPMのチェック
  const bpm: number = Number(form.bpm);
  if (
    Number.isNaN(bpm) ||
    bpm < 0.1 ||
    bpm > 999 ||
    form.bpm.replace(".", "").length > 7
  ) {
    return "bpm";
  }

  // Delayのチェック
  const delay: number = Number(form.delay);
  if (
    Number.isNaN(delay) ||
    delay < -999999 ||
    delay > 999999 ||
    form.delay.replace("-", "").replace(".", "").length > 7
  ) {
    return "delay";
  }

  // Splitのチェック
  const split = Number(form.split);
  if (!Number.isInteger(split) || split < 1 || split > 128) {
    return "split";
  }

  // Beatのチェック
  const beat = Number(form.beat);
  if (!Number.isInteger(beat) || beat < 1 || beat > 64) {
    return "beat";
  }

  // Rowsのチェック
  const rows = Number(form.rows);
  if (!Number.isInteger(rows) || rows < 1) {
    return "rows";
  }

  return null;
};

function EditBlockDialog() {
  const [resultError, setResultError] = useState<EditBlockDialogError | "">("");
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [form, setForm] = useRecoilState<EditBlockDialogForm>(
    editBlockDialogFormState
  );
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const onUpdate = useCallback(() => {
    const result: EditBlockDialogError | null = validate(form);
    if (result === null) {
      // form.blockIdx番目の譜面のブロックの行数の差分
      const deltaRows: number =
        Number(form.rows) - blocks[form.blockIdx].length;

      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([
        ...undoSnapshots,
        { blocks, notes: deltaRows === 0 ? null : notes },
      ]);
      setRedoShapshots([]);

      // form.blockIdx番目以降の譜面のブロックをすべて更新
      const updatedBlocks: Block[] = [...Array(blocks.length)].map(
        (_, blockIdx: number) =>
          blockIdx === form.blockIdx
            ? {
                accumulatedLength: blocks[form.blockIdx].accumulatedLength,
                beat: Number(form.beat),
                bpm: Number(form.bpm),
                delay: Number(form.delay),
                length: Number(form.rows),
                split: Number(form.split),
              }
            : blockIdx > form.blockIdx
            ? {
                ...blocks[blockIdx],
                accumulatedLength:
                  blocks[blockIdx - 1].accumulatedLength +
                  blocks[blockIdx - 1].length +
                  deltaRows,
              }
            : blocks[blockIdx]
      );

      // 行数を変更した場合のみ、form.blockIdx番目以降の譜面のブロックに該当する
      // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
      let updatedNotes: Note[][] = [...notes];
      if (deltaRows !== 0) {
        updatedNotes = [...notes].map((ns: Note[]) => {
          // form.blockIdx番目の譜面のブロックの行数が減った場合は、その減少分に該当する
          // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて削除
          const filteredNs: Note[] =
            deltaRows > 0
              ? ns
              : ns.filter(
                  (note: Note) =>
                    note.idx <
                      blocks[form.blockIdx].accumulatedLength +
                        blocks[form.blockIdx].length +
                        deltaRows ||
                    note.idx >=
                      blocks[form.blockIdx].accumulatedLength +
                        blocks[form.blockIdx].length
                );
          // (form.blockIdx +1)番目以降の譜面のブロックに該当する単ノート/ホールドの始点/
          // ホールドの中間/ホールドの終点の譜面全体の行インデックスをすべてズラす
          return filteredNs.map((note: Note) =>
            note.idx >=
            blocks[form.blockIdx].accumulatedLength +
              blocks[form.blockIdx].length
              ? { idx: note.idx + deltaRows, type: note.type }
              : note
          );
        });
      }

      setBlocks(updatedBlocks);
      if (deltaRows !== 0) setNotes(updatedNotes);
      setForm({
        beat: "",
        blockIdx: -1,
        bpm: "",
        delay: "",
        rows: "",
        open: false,
        split: "",
      });
    } else {
      // バリデーションエラーのテキストフィールドを表示
      setResultError(result);
    }
  }, [
    blocks,
    form,
    notes,
    setBlocks,
    setForm,
    setNotes,
    setResultError,
    setRedoShapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(
    () =>
      setForm({
        beat: "",
        blockIdx: -1,
        bpm: "",
        delay: "",
        rows: "",
        open: false,
        split: "",
      }),
    [setForm]
  );

  return (
    <Dialog open={form.open} onClose={onClose}>
      <DialogTitle>Edit Block</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            error={resultError === "bpm"}
            fullWidth
            helperText="Number of 4th Beats per Minute(0.1 - 999)"
            label="BPM"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({
                ...form,
                bpm: event.target.value,
              });
            }}
            size="small"
            type="number"
            value={form.bpm}
          />
          <TextField
            error={resultError === "delay"}
            fullWidth
            helperText="Offset time of Scrolling(-999999 - 999999)"
            label="Delay(ms)"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({
                ...form,
                delay: event.target.value,
              });
            }}
            size="small"
            type="number"
            value={form.delay}
          />
          <TextField
            error={resultError === "split"}
            fullWidth
            helperText="Number of UCS File's Rows per 4th Beat(1 - 128)"
            label="Split"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({
                ...form,
                split: event.target.value,
              });
            }}
            size="small"
            type="number"
            value={form.split}
          />
          <TextField
            error={resultError === "beat"}
            fullWidth
            helperText="Number of 4th Beats per Measure(1 - 64)"
            label="Beat"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({
                ...form,
                beat: event.target.value,
              });
            }}
            size="small"
            type="number"
            value={form.beat}
          />
          <TextField
            error={resultError === "rows"}
            fullWidth
            helperText="Number of UCS File's Rows(Over 1)"
            label="Rows"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({
                ...form,
                rows: event.target.value,
              });
            }}
            size="small"
            type="number"
            value={form.rows}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditBlockDialog;
