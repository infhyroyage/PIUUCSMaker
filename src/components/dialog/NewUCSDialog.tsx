import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isOpenedNewUCSDialogState,
  blocksState,
  notesState,
  isPerformanceState,
  ucsNameState,
  isProtectedState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../service/atoms";
import { ChangeEvent, useState, useTransition } from "react";
import {
  NewUCSDialogError,
  NewUCSDialogForm,
  NewUCSDialogValidation,
} from "../../types/dialog";
import { Block, Note } from "../../types/ucs";
import { ChartSnapshot } from "../../types/ucs";

const validate = (form: NewUCSDialogForm): NewUCSDialogValidation => {
  const errors: NewUCSDialogError[] = [];

  // UCSファイル名のチェック
  if (form.ucsName.length === 0) {
    errors.push("UCS File Name");
  }

  // BPMのチェック
  const bpm: number = Number(form.bpm);
  if (
    Number.isNaN(bpm) ||
    bpm < 0.1 ||
    bpm > 999 ||
    form.bpm.replace(".", "").length > 7
  ) {
    errors.push("BPM");
  }

  // Delayのチェック
  const delay: number = Number(form.delay);
  if (
    Number.isNaN(delay) ||
    delay < -999999 ||
    delay > 999999 ||
    form.delay.replace("-", "").replace(".", "").length > 7
  ) {
    errors.push("Delay(ms)");
  }

  // Splitのチェック
  const split = Number(form.split);
  if (!Number.isInteger(split) || split < 1 || split > 128) {
    errors.push("Split");
  }

  // Beatのチェック
  const beat = Number(form.beat);
  if (!Number.isInteger(beat) || beat < 1 || beat > 64) {
    errors.push("Beat");
  }

  // Rowsのチェック
  const rows = Number(form.rows);
  if (!Number.isInteger(rows) || rows < 1) {
    errors.push("Rows");
  }

  return {
    beat,
    bpm,
    delay,
    errors,
    rows,
    split,
  };
};

function NewUCSDialog() {
  const [form, setForm] = useState<NewUCSDialogForm>({
    beat: "4",
    bpm: "120",
    delay: "0",
    ucsName: "CS001",
    mode: "Single",
    rows: "50",
    split: "2",
  });
  const [isOpenedNewUCSDialog, setIsOpenedNewUCSDialog] =
    useRecoilState<boolean>(isOpenedNewUCSDialogState);
  const [errors, setErrors] = useState<NewUCSDialogError[]>([]);
  const setBlocks = useSetRecoilState<Block[]>(blocksState);
  const setIsPerformance = useSetRecoilState<boolean>(isPerformanceState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setNotes = useSetRecoilState<Note[][]>(notesState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const setUcsName = useSetRecoilState<string | null>(ucsNameState);
  const setUndoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(undoSnapshotsState);

  const [isPending, startTransition] = useTransition();

  const onCreate = () =>
    startTransition(() => {
      const result: NewUCSDialogValidation = validate(form);
      if (result.errors.length === 0) {
        setBlocks([
          {
            accumulatedRows: 0,
            beat: result.beat,
            bpm: result.bpm,
            delay: result.delay,
            rows: result.rows,
            split: result.split,
          },
        ]);
        setIsPerformance(
          ["SinglePerformance", "DoublePerformance"].includes(form.mode)
        );
        setIsProtected(false);
        setNotes(
          Array(["Single", "SinglePerformance"].includes(form.mode) ? 5 : 10)
            .fill(null)
            .map<Note[]>(() => [])
        );
        setRedoSnapshots([]);
        setUcsName(`${form.ucsName}.ucs`);
        setUndoSnapshots([]);
        setIsOpenedNewUCSDialog(false);
      } else {
        // バリデーションエラーのテキストフィールドを表示
        setErrors(result.errors);
      }
    });

  const onClose = () => setIsOpenedNewUCSDialog(false);

  return (
    <Dialog open={isOpenedNewUCSDialog} onClose={onClose}>
      <DialogTitle>New UCS</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            disabled={isPending}
            error={errors.includes("UCS File Name")}
            fullWidth
            helperText="Not Set Extension(.ucs)"
            label="UCS File Name"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, ucsName: event.target.value });
            }}
            size="small"
            value={form.ucsName}
          />
          <TextField
            disabled={isPending}
            fullWidth
            label="Mode"
            margin="dense"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, mode: event.target.value });
            }}
            select
            size="small"
            value={form.mode}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="SinglePerformance">Single Performance</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="DoublePerformance">Double Performance</MenuItem>
          </TextField>
          <TextField
            disabled={isPending}
            error={errors.includes("BPM")}
            fullWidth
            helperText="Number of 4th Beats per Minute(0.1 - 999)"
            label="BPM"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, bpm: event.target.value });
            }}
            size="small"
            type="number"
            value={form.bpm}
          />
          <TextField
            disabled={isPending}
            error={errors.includes("Delay(ms)")}
            fullWidth
            helperText="Offset time of Scrolling(-999999 - 999999)"
            label="Delay(ms)"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, delay: event.target.value });
            }}
            size="small"
            type="number"
            value={form.delay}
          />
          <TextField
            disabled={isPending}
            error={errors.includes("Split")}
            fullWidth
            helperText="Number of UCS File's Rows per 4th Beat(1 - 128)"
            label="Split"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, split: event.target.value });
            }}
            size="small"
            type="number"
            value={form.split}
          />
          <TextField
            disabled={isPending}
            error={errors.includes("Beat")}
            fullWidth
            helperText="Number of 4th Beats per Measure(1 - 64)"
            label="Beat"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, beat: event.target.value });
            }}
            size="small"
            type="number"
            value={form.beat}
          />
          <TextField
            disabled={isPending}
            error={errors.includes("Rows")}
            fullWidth
            helperText="Number of UCS File's Rows(Over 1)"
            label="Rows"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, rows: event.target.value });
            }}
            size="small"
            type="number"
            value={form.rows}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isPending} onClick={onCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewUCSDialog;
