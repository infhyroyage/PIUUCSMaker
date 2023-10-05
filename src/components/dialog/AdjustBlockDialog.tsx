import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  redoSnapshotsState,
  undoSnapshotsState,
  adjustBlockDialogFixedState,
  blockControllerMenuBlockIdxState,
  notesState,
} from "../../service/atoms";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  AdjustBlockDialogFixed,
  AdjustBlockDialogForm,
} from "../../types/dialog";
import { Block, Note } from "../../types/chart";
import { ChartSnapshot } from "../../types/ui";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function AdjustBlockDialog() {
  const [adjustBlockDialogFixed, setAdjustBlockDialogFixed] =
    useRecoilState<AdjustBlockDialogFixed>(adjustBlockDialogFixedState);
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const menuBlockIdx = useRecoilValue<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const [form, setForm] = useState<AdjustBlockDialogForm>({
    bpm: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].bpm,
    rows: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].length,
    split: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].split,
    title:
      adjustBlockDialogFixed === "bpm"
        ? "Adjust Split & Rows (BPM Fixed)"
        : "Adjust Split & BPM (Rows Fixed)",
  });

  const onUpdate = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoShapshots([]);

      // menuBlock.blockIdx番目以降の譜面のブロックをすべて更新
      // TODO: blockIdx + 1番目以降のnote.idxも全更新する必要あり
      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks[menuBlockIdx] = {
        accumulatedLength: blocks[menuBlockIdx].accumulatedLength,
        beat: blocks[menuBlockIdx].beat,
        bpm: Number(form.bpm),
        delay: blocks[menuBlockIdx].delay,
        length: Number(form.rows),
        split: Number(form.split),
      };
      for (let idx = menuBlockIdx + 1; idx < blocks.length; idx++) {
        updatedBlocks[idx] = {
          ...updatedBlocks[idx],
          accumulatedLength:
            updatedBlocks[idx - 1].accumulatedLength +
            updatedBlocks[idx - 1].length,
        };
      }

      setBlocks(updatedBlocks);
    }

    setAdjustBlockDialogFixed("");
  }, [
    blocks,
    form,
    menuBlockIdx,
    setAdjustBlockDialogFixed,
    setBlocks,
    setRedoShapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(
    () => setAdjustBlockDialogFixed(""),
    [setAdjustBlockDialogFixed]
  );

  return (
    menuBlockIdx !== null && (
      <Dialog open={adjustBlockDialogFixed.length > 0} onClose={onClose}>
        <DialogTitle>{form.title}</DialogTitle>
        <DialogContent>
          <Grid container mt={1} spacing={3} textAlign="center">
            <Grid item xs={3} />
            <Grid item xs={4}>
              <Typography variant="subtitle1">Before</Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={4}>
              <Typography variant="subtitle1">After</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Split</Typography>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3}>{blocks[menuBlockIdx].split}</Paper>
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3}>{form.split}</Paper>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">BPM</Typography>
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "bpm" ? (
                <Typography>{blocks[menuBlockIdx].bpm}</Typography>
              ) : (
                <Paper elevation={3}>{blocks[menuBlockIdx].bpm}</Paper>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "bpm" ? (
                <Typography>{form.bpm}</Typography>
              ) : (
                <Paper elevation={3}>{form.bpm}</Paper>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Rows</Typography>
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "rows" ? (
                <Typography>{blocks[menuBlockIdx].length}</Typography>
              ) : (
                <Paper elevation={3}>{blocks[menuBlockIdx].length}</Paper>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "rows" ? (
                <Typography>{form.rows}</Typography>
              ) : (
                <Paper elevation={3}>{form.rows}</Paper>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    )
  );
}

export default AdjustBlockDialog;
