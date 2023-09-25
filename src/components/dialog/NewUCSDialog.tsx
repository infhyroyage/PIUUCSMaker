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
  columnsState,
  isPerformanceState,
  ucsNameState,
} from "../../service/atoms";
import { ChangeEvent, useState, useTransition } from "react";
import {
  NewUCSDialogErrors,
  NewUCSDialogForm,
  NewUCSValidation,
} from "../../types/form";
import { Block, Note } from "../../types/chart";

const validateAndLoadUCS = (
  form: NewUCSDialogForm
): NewUCSValidation | NewUCSDialogErrors => {
  // UCSファイル名のチェック
  if (form.ucsName.length === 0) {
    return "ucsName";
  }

  // モードのチェック
  let columns: 5 | 10;
  let isPerformance: boolean;
  switch (form.mode) {
    case "Single":
      columns = 5;
      isPerformance = false;
      break;
    case "SinglePerformance":
      columns = 5;
      isPerformance = true;
      break;
    case "Double":
      columns = 10;
      isPerformance = false;
      break;
    case "DoublePerformance":
      columns = 10;
      isPerformance = true;
      break;
    default:
      return "mode";
  }

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

  // 行数のチェック
  const length = Number(form.rowLength);
  if (!Number.isInteger(length) || length < 1) {
    return "rowLength";
  }

  return {
    block: { bpm, delay, beat, split, length, accumulatedLength: 0 },
    columns,
    isPerformance,
  };
};

function NewUCSDialog() {
  const [form, setForm] = useState<NewUCSDialogForm>({
    beat: "4",
    bpm: "120",
    delay: "0",
    ucsName: "CS001",
    mode: "Single",
    rowLength: "50",
    split: "2",
  });
  const [isOpenedNewUCSDialog, setIsOpenedNewUCSDialog] =
    useRecoilState<boolean>(isOpenedNewUCSDialogState);
  const [resultError, setResultError] = useState<NewUCSDialogErrors | "">("");
  const setBlocks = useSetRecoilState<Block[]>(blocksState);
  const setColumns = useSetRecoilState<5 | 10>(columnsState);
  const setIsPerformance = useSetRecoilState<boolean>(isPerformanceState);
  const setNotes = useSetRecoilState<Note[][]>(notesState);
  const setUcsName = useSetRecoilState<string | null>(ucsNameState);

  const [isPending, startTransition] = useTransition();

  const onCreate = () =>
    startTransition(() => {
      const result: NewUCSValidation | NewUCSDialogErrors =
        validateAndLoadUCS(form);
      if (typeof result === "string") {
        // バリデーションエラーのテキストフィールドを表示
        setResultError(result);
      } else {
        setBlocks([result.block]);
        setColumns(result.columns);
        setIsPerformance(result.isPerformance);
        setNotes(
          Array(result.columns)
            .fill(null)
            .map<Note[]>(() => [])
        );
        setUcsName(`${form.ucsName}.ucs`);
        setIsOpenedNewUCSDialog(false);
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
            error={resultError === "ucsName"}
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
            error={resultError === "mode"}
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
            error={resultError === "bpm"}
            fullWidth
            helperText="0.1 - 999"
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
            error={resultError === "delay"}
            fullWidth
            helperText="-999999 - 999999"
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
            error={resultError === "beat"}
            fullWidth
            helperText="1 - 64"
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
            error={resultError === "split"}
            fullWidth
            helperText="1 - 128"
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
            error={resultError === "rowLength"}
            fullWidth
            helperText="Over 1"
            label="Row Length"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, rowLength: event.target.value });
            }}
            size="small"
            type="number"
            value={form.rowLength}
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