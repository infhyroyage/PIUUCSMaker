import { useCallback, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  blocksState,
  editBlockDialogFormState,
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
import { EditBlockDialogError, EditBlockDialogForm } from "../../types/form";
import { Block } from "../../types/chart";
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

  // Beatのチェック
  const beat = Number(form.beat);
  if (!Number.isInteger(beat) || beat < 1 || beat > 64) {
    return "beat";
  }

  // Splitのチェック
  const split = Number(form.split);
  if (!Number.isInteger(split) || split < 1 || split > 128) {
    return "split";
  }

  return null;
};

function EditBlockDialog() {
  const [resultError, setResultError] = useState<EditBlockDialogError | "">("");
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [form, setForm] = useRecoilState<EditBlockDialogForm>(
    editBlockDialogFormState
  );
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const onEdit = useCallback(() => {
    const result: EditBlockDialogError | null = validate(form);
    if (result === null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoShapshots([]);

      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks[form.blockIdx] = {
        accumulatedLength: blocks[form.blockIdx].accumulatedLength,
        beat: Number(form.beat),
        bpm: Number(form.bpm),
        delay: Number(form.delay),
        length: blocks[form.blockIdx].length,
        split: Number(form.split),
      };
      setBlocks(updatedBlocks);
      setForm({
        beat: "",
        blockIdx: -1,
        bpm: "",
        delay: "",
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
    setBlocks,
    setForm,
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
            helperText="0.1 - 999"
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
            helperText="-999999 - 999999"
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
            error={resultError === "beat"}
            fullWidth
            helperText="1 - 64"
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
            error={resultError === "split"}
            fullWidth
            helperText="1 - 128"
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onEdit}>Edit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditBlockDialog;
