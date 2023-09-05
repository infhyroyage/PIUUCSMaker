import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  chartState,
  isOpenedNewFileDialogState,
  fileNamesState,
} from "../service/atoms";
import { useState, useTransition } from "react";
import { NewFileDialogForm } from "../types/form";
import { Chart, Note } from "../types/ucs";
import { FileNames } from "../types/atoms";

const validateAndLoadUCS = (form: NewFileDialogForm): Chart | string => {
  // UCSファイル名のチェック
  if (form.fileName.length === 0) {
    return "fileName";
  }

  // モードのチェック
  let chartLength: 5 | 10;
  let isPerformance: boolean;
  switch (form.mode) {
    case "Single":
      chartLength = 5;
      isPerformance = false;
      break;
    case "SinglePerformance":
      chartLength = 5;
      isPerformance = true;
      break;
    case "Double":
      chartLength = 10;
      isPerformance = false;
      break;
    case "DoublePerformance":
      chartLength = 10;
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
  const blockLength = Number(form.rowLength);
  if (!Number.isInteger(blockLength) || blockLength < 1) {
    return "rowLength";
  }

  return {
    length: chartLength,
    isPerformance,
    blocks: [
      {
        bpm,
        delay,
        beat,
        split,
        length: blockLength,
        accumulatedLength: 0,
      },
    ],
    notes: Array(chartLength)
      .fill(null)
      .map<Note[]>(() => []),
  };
};

function NewFileDialog() {
  const [form, setForm] = useState<NewFileDialogForm>({
    beat: "4",
    bpm: "120",
    delay: "0",
    fileName: "CS001",
    mode: "Single",
    rowLength: "50",
    split: "2",
  });
  const [fileNames, setFileNames] = useRecoilState<FileNames>(fileNamesState);
  const setChart = useSetRecoilState<Chart>(chartState);
  const [isOpenedNewFileDialog, setIsOpenedNewFileDialog] =
    useRecoilState<boolean>(isOpenedNewFileDialogState);

  const [isPending, startTransition] = useTransition();

  const onCreate = () =>
    startTransition(() => {
      const result: Chart | string = validateAndLoadUCS(form);
      if (typeof result === "string") {
        // TODO: テキストフィールドにエラーを表示
      } else {
        setFileNames({ ...fileNames, ucs: `${form.fileName}.ucs` });
        setChart(result);
        setIsOpenedNewFileDialog(false);
      }
    });

  const onClose = () => setIsOpenedNewFileDialog(false);

  return (
    <Dialog open={isOpenedNewFileDialog} onClose={onClose}>
      <DialogTitle>New UCS</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            disabled={isPending}
            fullWidth
            helperText="Not Set Extension(.ucs)"
            label="UCS File Name"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, fileName: event.target.value });
            }}
            size="small"
            value={form.fileName}
          />
          <Select
            disabled={isPending}
            fullWidth
            label="Mode" // TODO: ラベルが効いていない
            margin="dense"
            onChange={(event: SelectChangeEvent) => {
              setForm({ ...form, mode: event.target.value });
            }}
            size="small"
            value={form.mode}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="SinglePerformance">Single Performance</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="DoublePerformance">Double Performance</MenuItem>
          </Select>
          <TextField
            disabled={isPending}
            fullWidth
            helperText="0.1 - 999"
            label="BPM"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, bpm: event.target.value });
            }}
            size="small"
            value={form.bpm}
          />
          <TextField
            disabled={isPending}
            fullWidth
            helperText="-999999 - 999999"
            label="Delay(ms)"
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, delay: event.target.value });
            }}
            size="small"
            value={form.delay}
          />
          <TextField
            disabled={isPending}
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

export default NewFileDialog;
