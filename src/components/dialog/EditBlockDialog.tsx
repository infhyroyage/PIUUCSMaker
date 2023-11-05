import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  blockControllerMenuBlockIdxState,
  blocksState,
  isOpenedEditBlockDialogState,
  isProtectedState,
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
import { Block, Note } from "../../types/ucs";
import { ChartSnapshot } from "../../types/ucs";
import {
  validateBeat,
  validateBpm,
  validateDelay,
  validateRows,
  validateSplit,
} from "../../service/validation";

function EditBlockDialog() {
  const [form, setForm] = useState<EditBlockDialogForm>({
    beat: "",
    bpm: "",
    delay: "",
    rows: "",
    split: "",
  });
  const [errors, setErrors] = useState<EditBlockDialogError[]>([]);
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [menuBlockIdx, setMenuBlockIdx] = useRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [open, setOpen] = useRecoilState<boolean>(isOpenedEditBlockDialogState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  useEffect(
    () =>
      setForm({
        beat: menuBlockIdx === null ? "" : `${blocks[menuBlockIdx].beat}`,
        bpm: menuBlockIdx === null ? "" : `${blocks[menuBlockIdx].bpm}`,
        delay: menuBlockIdx === null ? "" : `${blocks[menuBlockIdx].delay}`,
        rows: menuBlockIdx === null ? "" : `${blocks[menuBlockIdx].rows}`,
        split: menuBlockIdx === null ? "" : `${blocks[menuBlockIdx].split}`,
      }),
    [blocks, menuBlockIdx, setForm]
  );

  const onUpdate = useCallback(() => {
    // BlockControllerMenuのメニューを開いていない場合はNOP
    if (menuBlockIdx === null) return;

    // バリデーションチェック
    const beat: number | null = validateBeat(form.beat);
    const bpm: number | null = validateBpm(form.bpm);
    const delay: number | null = validateDelay(form.delay);
    const rows: number | null = validateRows(form.rows);
    const split: number | null = validateSplit(form.split);
    if (
      beat !== null &&
      bpm !== null &&
      delay !== null &&
      rows !== null &&
      split !== null
    ) {
      // menuBlockIdx番目の譜面のブロックの行数の差分
      const deltaRows: number = rows - blocks[menuBlockIdx].rows;

      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([
        ...undoSnapshots,
        { blocks, notes: deltaRows === 0 ? null : notes },
      ]);
      setRedoSnapshots([]);

      // menuBlockIdx番目以降の譜面のブロックをすべて更新
      const updatedBlocks: Block[] = [...Array(blocks.length)].map(
        (_, blockIdx: number) =>
          blockIdx === menuBlockIdx
            ? {
                accumulatedRows: blocks[menuBlockIdx].accumulatedRows,
                beat: beat,
                bpm: bpm,
                delay: delay,
                rows: rows,
                split: split,
              }
            : blockIdx > menuBlockIdx
            ? {
                ...blocks[blockIdx],
                accumulatedRows:
                  blocks[blockIdx - 1].accumulatedRows +
                  blocks[blockIdx - 1].rows +
                  deltaRows,
              }
            : blocks[blockIdx]
      );

      // 行数を変更した場合のみ、menuBlockIdx番目以降の譜面のブロックに該当する
      // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
      let updatedNotes: Note[][] = [...notes];
      if (deltaRows !== 0) {
        // 以下の譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
        // * (menuBlockIdx - 1)番目以前: 更新しない
        // * menuBlockIdx番目          : 譜面全体の行インデックスをスケーリング(空白 < X < H < M < W)
        // * (menuBlockIdx + 1)番目以降: 譜面全体の行インデックスを譜面のブロックの行数の差分ズラす
        updatedNotes = [...notes].map((ns: Note[]) => [
          // (menuBlockIdx - 1)番目以前の譜面のブロック
          ...ns.filter(
            (note: Note) => note.rowIdx < blocks[menuBlockIdx].accumulatedRows
          ),
          // menuBlockIdx番目の譜面のブロック
          ...ns
            .filter(
              (note: Note) =>
                note.rowIdx >= blocks[menuBlockIdx].accumulatedRows &&
                note.rowIdx <
                  blocks[menuBlockIdx].accumulatedRows +
                    blocks[menuBlockIdx].rows
            )
            .reduce((prev: Note[], note: Note) => {
              const scaledRowIdx: number =
                blocks[menuBlockIdx].accumulatedRows +
                Math.floor(
                  ((note.rowIdx - blocks[menuBlockIdx].accumulatedRows) *
                    rows) /
                    blocks[menuBlockIdx].rows
                );
              const prevScaledNote: Note | undefined = prev.find(
                (note: Note) => note.rowIdx === scaledRowIdx
              );

              return prevScaledNote
                ? [
                    ...prev.slice(0, prev.length - 1),
                    {
                      rowIdx: scaledRowIdx,
                      type:
                        prevScaledNote.type === "X" ||
                        (prevScaledNote.type === "H" &&
                          ["M", "W"].includes(note.type)) ||
                        (prevScaledNote.type === "M" && note.type === "W")
                          ? note.type
                          : prevScaledNote.type,
                    },
                  ]
                : [...prev, { rowIdx: scaledRowIdx, type: note.type }];
            }, []),
          // (menuBlockIdx + 1)番目以降の譜面のブロック
          ...ns
            .filter(
              (note: Note) =>
                note.rowIdx >=
                blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
            )
            .map((note: Note) => {
              return { rowIdx: note.rowIdx + deltaRows, type: note.type };
            }),
        ]);
      }

      setIsProtected(true);

      setBlocks(updatedBlocks);
      if (deltaRows !== 0) setNotes(updatedNotes);

      setMenuBlockIdx(null);
      setOpen(false);
    } else {
      // バリデーションエラーのテキストフィールドをすべて表示
      const errors: EditBlockDialogError[] = [];
      if (beat === null) errors.push("Beat");
      if (bpm === null) errors.push("BPM");
      if (delay === null) errors.push("Delay(ms)");
      if (rows === null) errors.push("Rows");
      if (split === null) errors.push("Split");
      setErrors(errors);
    }
  }, [
    blocks,
    form,
    menuBlockIdx,
    notes,
    setBlocks,
    setIsProtected,
    setMenuBlockIdx,
    setNotes,
    setOpen,
    setErrors,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(() => {
    setMenuBlockIdx(null);
    setOpen(false);
  }, [setForm, setOpen]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Block</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            error={errors.includes("BPM")}
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
            error={errors.includes("Delay(ms)")}
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
            error={errors.includes("Split")}
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
            error={errors.includes("Beat")}
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
            error={errors.includes("Rows")}
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
