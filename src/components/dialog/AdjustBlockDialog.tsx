import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  redoSnapshotsState,
  undoSnapshotsState,
  adjustBlockDialogOpenState,
  blockControllerMenuBlockIdxState,
  notesState,
} from "../../service/atoms";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  AdjustBlockDialogForm,
  AdjustBlockDialogOpen,
} from "../../types/dialog";
import { Block, Note } from "../../types/chart";
import { ChartSnapshot } from "../../types/ui";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

/**
 * 入力したBPM値に対し、整数部と小数部の数値の合計個数が8個以上の場合のみ、最大7個になるように小数点以下を四捨五入する
 * @param {number} bpm BPM値
 * @returns {number} 四捨五入したBPM値
 */
const roundBpm = (bpm: number): number =>
  bpm.toString().replace(".", "").length < 8
    ? bpm
    : parseFloat(
        bpm.toFixed(Math.max(7 - Math.floor(bpm).toString().length, 0))
      );

function AdjustBlockDialog() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [open, setOpen] = useRecoilState<AdjustBlockDialogOpen>(
    adjustBlockDialogOpenState
  );
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const menuBlockIdx = useRecoilValue<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const [form, setForm] = useState<AdjustBlockDialogForm>({
    bpm: -1,
    rows: -1,
    split: -1,
  });

  useEffect(
    () =>
      setForm({
        bpm: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].bpm,
        rows: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].length,
        split: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].split,
      }),
    [blocks, menuBlockIdx]
  );

  const onUpdate = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoShapshots([]);

      // menuBlock.blockIdx番目以降の譜面のブロックをすべて更新
      // TODO: blockIdx番目以降のnote.idxも全更新する必要あり
      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks[menuBlockIdx] = {
        accumulatedLength: blocks[menuBlockIdx].accumulatedLength,
        beat: blocks[menuBlockIdx].beat,
        bpm: roundBpm(form.bpm),
        delay: blocks[menuBlockIdx].delay,
        length: form.rows,
        split: form.split,
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

    setOpen({ fixed: open.fixed, open: false });
  }, [
    blocks,
    form,
    menuBlockIdx,
    open.fixed,
    setOpen,
    setBlocks,
    setRedoShapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(
    () => setOpen({ fixed: open.fixed, open: false }),
    [open.fixed, setOpen]
  );

  return (
    menuBlockIdx !== null && (
      <Dialog open={open.open} onClose={onClose}>
        <DialogTitle>
          {open.fixed === "bpm"
            ? "Adjust Split & Rows (BPM Fixed)"
            : "Adjust Split & BPM (Rows Fixed)"}
        </DialogTitle>
        <DialogContent>
          <Grid
            columns={14}
            container
            mt={1}
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <Grid item xs={2} />
            <Grid item xs={5.5}>
              Before
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5.5}>
              After
            </Grid>
            <Grid item xs={2}>
              Split
            </Grid>
            <Grid item xs={5.5}>
              <Paper elevation={3} sx={{ padding: 1 }}>
                <Typography variant="h6">
                  {blocks[menuBlockIdx].split}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5.5}>
              <Paper elevation={3} sx={{ padding: 1 }}>
                <Typography variant="h6">{form.split}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={open.fixed === "rows" && form.bpm * form.split > 999}
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      open.fixed === "bpm" ? form.bpm : form.bpm * form.split,
                    rows:
                      open.fixed === "rows"
                        ? form.rows
                        : form.rows * form.split,
                    split: 1,
                  })
                }
                variant="contained"
              >
                MIN
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={
                  form.split % 2 !== 0 ||
                  form.split < 2 ||
                  (open.fixed === "rows" && form.bpm > 499.5)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: open.fixed === "bpm" ? form.bpm : form.bpm * 2,
                    rows: open.fixed === "rows" ? form.rows : form.rows * 2,
                    split: form.split / 2,
                  })
                }
                variant="contained"
              >
                /2
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={
                  form.split < 2 ||
                  (open.fixed === "bpm" &&
                    (form.rows * form.split) % (form.split - 1) !== 0) ||
                  (open.fixed === "rows" &&
                    form.bpm * form.split > 999 * (form.split - 1))
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      open.fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / (form.split - 1),
                    rows:
                      open.fixed === "rows"
                        ? form.rows
                        : (form.rows * form.split) / (form.split - 1),
                    split: form.split - 1,
                  })
                }
                variant="contained"
              >
                -1
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={
                  form.split > 127 ||
                  (open.fixed === "bpm" &&
                    (form.rows * form.split) % (form.split + 1) !== 0) ||
                  (open.fixed === "bpm" &&
                    form.rows * form.split < form.split + 1) ||
                  (open.fixed === "rows" &&
                    form.bpm * form.split * 10 < form.split + 1)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      open.fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / (form.split + 1),
                    rows:
                      open.fixed === "rows"
                        ? form.rows
                        : (form.rows * form.split) / (form.split + 1),
                    split: form.split + 1,
                  })
                }
                variant="contained"
              >
                +1
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={
                  form.split > 64 ||
                  (open.fixed === "bpm" && form.rows % 2 !== 0) ||
                  (open.fixed === "bpm" && form.rows < 2) ||
                  (open.fixed === "rows" && form.bpm < 0.2)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: open.fixed === "bpm" ? form.bpm : form.bpm / 2,
                    rows: open.fixed === "rows" ? form.rows : form.rows / 2,
                    split: form.split * 2,
                  })
                }
                variant="contained"
              >
                x2
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={
                  (open.fixed === "bpm" &&
                    (form.rows * form.split) % 128 !== 0) ||
                  (open.fixed === "bpm" && form.rows * form.split < 128) ||
                  (open.fixed === "rows" && form.bpm * form.split < 12.8)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      open.fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / 128,
                    rows:
                      open.fixed === "rows"
                        ? form.rows
                        : (form.rows * form.split) / 128,
                    split: 128,
                  })
                }
                variant="contained"
              >
                MAX
              </Button>
            </Grid>
            <Grid item xs={14}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              BPM
            </Grid>
            <Grid item xs={5.5}>
              {open.fixed === "bpm" ? (
                <Typography variant="h6">{blocks[menuBlockIdx].bpm}</Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">
                    {blocks[menuBlockIdx].bpm}
                  </Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5.5}>
              {open.fixed === "bpm" ? (
                <Typography variant="h6">{`${form.bpm} (fixed)`}</Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">{roundBpm(form.bpm)}</Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  open.fixed === "bpm" || form.bpm < 0.2 || form.split > 64
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm / 2,
                    rows: form.rows,
                    split: form.split * 2,
                  })
                }
                variant="contained"
              >
                /2
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  open.fixed === "bpm" ||
                  form.bpm > 499.5 ||
                  form.split % 2 !== 0 ||
                  form.split < 2
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm * 2,
                    rows: form.rows,
                    split: form.split / 2,
                  })
                }
                variant="contained"
              >
                x2
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={14}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              Rows
            </Grid>
            <Grid item xs={5.5}>
              {open.fixed === "rows" ? (
                <Typography variant="h6">
                  {blocks[menuBlockIdx].length}
                </Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">
                    {blocks[menuBlockIdx].length}
                  </Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5.5}>
              {open.fixed === "rows" ? (
                <Typography variant="h6">{`${form.rows} (fixed)`}</Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">{form.rows}</Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  open.fixed === "rows" ||
                  form.rows % 2 !== 0 ||
                  form.rows < 2 ||
                  form.split > 64
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm,
                    rows: form.rows / 2,
                    split: form.split * 2,
                  })
                }
                variant="contained"
              >
                /2
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  open.fixed === "rows" ||
                  form.split % 2 !== 0 ||
                  form.split < 2
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm,
                    rows: form.rows * 2,
                    split: form.split / 2,
                  })
                }
                variant="contained"
              >
                x2
              </Button>
            </Grid>
            <Grid item xs={2} />
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
