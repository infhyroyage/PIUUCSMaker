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
  Divider,
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
      // TODO: blockIdx番目以降のnote.idxも全更新する必要あり
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
          <Grid
            columns={11}
            container
            mt={1}
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <Grid item xs={2} />
            <Grid item xs={4}>
              Before
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={4}>
              After
            </Grid>
            <Grid item xs={2}>
              Split
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 1 }}>
                <Typography variant="h6">
                  {blocks[menuBlockIdx].split}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 1 }}>
                <Typography variant="h6">{form.split}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                MIN
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                /2
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                -1
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                +1
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                x2
              </Button>
            </Grid>
            <Grid item xs={1.5}>
              <Button fullWidth variant="contained">
                MAX
              </Button>
            </Grid>
            <Grid item xs={11}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              BPM
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "bpm" ? (
                <Typography>{blocks[menuBlockIdx].bpm}</Typography>
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
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "bpm" ? (
                <Typography>{`${form.bpm}(fixed)`}</Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">{form.bpm}</Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={1.5} />
            <Grid item xs={1.5}>
              <Button
                disabled={adjustBlockDialogFixed === "bpm"}
                fullWidth
                variant="contained"
              >
                /2
              </Button>
            </Grid>
            <Grid item xs={1.5} />
            <Grid item xs={1.5} />
            <Grid item xs={1.5}>
              <Button
                disabled={adjustBlockDialogFixed === "bpm"}
                fullWidth
                variant="contained"
              >
                x2
              </Button>
            </Grid>
            <Grid item xs={1.5} />
            <Grid item xs={11}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              Rows
            </Grid>
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "rows" ? (
                <Typography>{blocks[menuBlockIdx].length}</Typography>
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
            <Grid item xs={4}>
              {adjustBlockDialogFixed === "rows" ? (
                <Typography>{`${form.rows}(fixed)`}</Typography>
              ) : (
                <Paper elevation={3} sx={{ padding: 1 }}>
                  <Typography variant="h6">{form.rows}</Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={1.5} />
            <Grid item xs={1.5}>
              <Button
                disabled={adjustBlockDialogFixed === "rows"}
                fullWidth
                variant="contained"
              >
                /2
              </Button>
            </Grid>
            <Grid item xs={1.5} />
            <Grid item xs={1.5} />
            <Grid item xs={1.5}>
              <Button
                disabled={adjustBlockDialogFixed === "rows"}
                fullWidth
                variant="contained"
              >
                x2
              </Button>
            </Grid>
            <Grid item xs={1.5} />
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
