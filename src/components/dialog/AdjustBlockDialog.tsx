import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  blocksState,
  redoSnapshotsState,
  undoSnapshotsState,
  isOpenedAdjustBlockDialogState,
  blockControllerMenuBlockIdxState,
  notesState,
  isProtectedState,
} from "../../services/atoms";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Radio,
  Typography,
} from "@mui/material";
import {
  AdjustBlockDialogForm,
  AdjustBlockDialogFormFixed,
} from "../../types/dialog";
import { Block, Note } from "../../types/ucs";
import { ChartSnapshot } from "../../types/ucs";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { roundBpm } from "../../services/validations";

function AdjustBlockDialog() {
  const [fixed, setFixed] = useState<AdjustBlockDialogFormFixed>("bpm");
  const [form, setForm] = useState<AdjustBlockDialogForm>({
    bpm: -1,
    rows: -1,
    split: -1,
  });
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [open, setOpen] = useRecoilState<boolean>(
    isOpenedAdjustBlockDialogState
  );
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const [menuBlockIdx, setMenuBlockIdx] = useRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const menuBlock = useMemo(
    () => (menuBlockIdx === null ? null : blocks[menuBlockIdx]),
    [blocks, menuBlockIdx]
  );

  useEffect(
    () =>
      setForm({
        bpm: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].bpm,
        rows: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].rows,
        split: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].split,
      }),
    [blocks, menuBlockIdx, setForm]
  );

  const onUpdate = useCallback(() => {
    // BlockControllerMenuのメニューを開いていない場合はNOP
    if (menuBlockIdx === null) return;

    // menuBlockIdx番目の譜面のブロックの行数の差分
    const deltaRows: number = Number(form.rows) - blocks[menuBlockIdx].rows;

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
              beat: blocks[menuBlockIdx].beat,
              bpm: roundBpm(form.bpm),
              delay: blocks[menuBlockIdx].delay,
              rows: form.rows,
              split: form.split,
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
                blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
          )
          .reduce((prev: Note[], note: Note) => {
            const scaledRowIdx: number =
              blocks[menuBlockIdx].accumulatedRows +
              Math.floor(
                ((note.rowIdx - blocks[menuBlockIdx].accumulatedRows) *
                  Number(form.rows)) /
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
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(() => {
    setMenuBlockIdx(null);
    setOpen(false);
  }, [setMenuBlockIdx, setOpen]);

  return (
    menuBlockIdx !== null &&
    menuBlock !== null && (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Adjust Split/Rows/BPM</DialogTitle>
        <DialogContent>
          <Grid
            columns={14}
            container
            mt={1}
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <Grid item xs={3}>
              Fix
            </Grid>
            <Grid item xs={5}>
              Before
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              After
            </Grid>
            <Grid item xs={1}>
              <Radio
                checked={fixed === "split"}
                onChange={() => setFixed("split")}
                value="split"
              />
            </Grid>
            <Grid item xs={2}>
              <Typography
                onClick={() => setFixed("split")}
                variant={fixed === "split" ? "body2" : "h6"}
              >
                Split
              </Typography>
            </Grid>
            <Grid item xs={5}>
              {fixed === "split" ? (
                blocks[menuBlockIdx].split
              ) : (
                <Typography variant="h6">
                  {blocks[menuBlockIdx].split}
                </Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5}>
              {fixed === "split" ? (
                `${form.split} (fixed)`
              ) : (
                <Typography variant="h6">{form.split}</Typography>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  fixed === "split" ||
                  (fixed === "bpm" && form.rows % form.split !== 0) ||
                  (fixed === "bpm" && form.rows < form.split) ||
                  (fixed === "rows" && form.bpm * form.split > 999)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: fixed === "bpm" ? form.bpm : form.bpm * form.split,
                    rows: fixed === "rows" ? form.rows : form.rows / form.split,
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
                  fixed === "split" ||
                  form.split % 2 !== 0 ||
                  form.split < 2 ||
                  (fixed === "bpm" && form.rows % 2 !== 0) ||
                  (fixed === "bpm" && form.rows < 2) ||
                  (fixed === "rows" && form.bpm > 499.5)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: fixed === "bpm" ? form.bpm : form.bpm * 2,
                    rows: fixed === "rows" ? form.rows : form.rows / 2,
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
                  fixed === "split" ||
                  form.split < 2 ||
                  (fixed === "bpm" &&
                    (form.rows * (form.split - 1)) % form.split !== 0) ||
                  (fixed === "bpm" &&
                    form.rows * (form.split - 1) < form.split) ||
                  (fixed === "rows" &&
                    form.bpm * form.split > 999 * (form.split - 1))
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / (form.split - 1),
                    rows:
                      fixed === "rows"
                        ? form.rows
                        : (form.rows * (form.split - 1)) / form.split,
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
                  fixed === "split" ||
                  form.split > 127 ||
                  (fixed === "bpm" &&
                    (form.rows * (form.split + 1)) % form.split !== 0) ||
                  (fixed === "rows" &&
                    form.bpm * form.split * 10 < form.split + 1)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / (form.split + 1),
                    rows:
                      fixed === "rows"
                        ? form.rows
                        : (form.rows * (form.split + 1)) / form.split,
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
                  fixed === "split" ||
                  form.split > 64 ||
                  (fixed === "rows" && form.bpm < 0.2)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: fixed === "bpm" ? form.bpm : form.bpm / 2,
                    rows: fixed === "rows" ? form.rows : form.rows * 2,
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
                  fixed === "split" ||
                  (fixed === "bpm" && (form.rows * 128) % form.split !== 0) ||
                  (fixed === "rows" && form.bpm * form.split < 12.8)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm:
                      fixed === "bpm"
                        ? form.bpm
                        : (form.bpm * form.split) / 128,
                    rows:
                      fixed === "rows"
                        ? form.rows
                        : (form.rows * 128) / form.split,
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
            <Grid item xs={1}>
              <Radio
                checked={fixed === "rows"}
                onChange={() => setFixed("rows")}
                value="rows"
              />
            </Grid>
            <Grid item xs={2}>
              <Typography
                onClick={() => setFixed("rows")}
                variant={fixed === "rows" ? "body2" : "h6"}
              >
                Rows
              </Typography>
            </Grid>
            <Grid item xs={5}>
              {fixed === "rows" ? (
                menuBlock.rows
              ) : (
                <Typography variant="h6">{menuBlock.rows}</Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5}>
              {fixed === "rows" ? (
                `${form.rows} (fixed)`
              ) : (
                <Typography variant="h6">{form.rows}</Typography>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  fixed === "rows" ||
                  form.rows % 2 !== 0 ||
                  form.rows < 2 ||
                  (fixed === "bpm" && form.split % 2 !== 0) ||
                  (fixed === "bpm" && form.split < 2) ||
                  (fixed === "split" && form.bpm < 0.2)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: fixed === "bpm" ? form.bpm : form.bpm / 2,
                    rows: form.rows / 2,
                    split: fixed === "split" ? form.split : form.split / 2,
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
                  fixed === "rows" ||
                  (fixed === "bpm" && form.split > 64) ||
                  (fixed === "split" && form.bpm > 499.5)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: fixed === "bpm" ? form.bpm : form.bpm * 2,
                    rows: form.rows * 2,
                    split: fixed === "split" ? form.split : form.split * 2,
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
            <Grid item xs={1}>
              <Radio
                checked={fixed === "bpm"}
                onChange={() => setFixed("bpm")}
                value="bpm"
              />
            </Grid>
            <Grid item xs={2}>
              <Typography
                onClick={() => setFixed("bpm")}
                variant={fixed === "bpm" ? "body2" : "h6"}
              >
                BPM
              </Typography>
            </Grid>
            <Grid item xs={5}>
              {fixed === "bpm" ? (
                menuBlock.bpm
              ) : (
                <Typography variant="h6">{menuBlock.bpm}</Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <ArrowRightIcon />
            </Grid>
            <Grid item xs={5}>
              {fixed === "bpm" ? (
                `${form.bpm} (fixed)`
              ) : (
                <Typography variant="h6">{roundBpm(form.bpm)}</Typography>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={2} />
            <Grid item xs={2}>
              <Button
                disabled={
                  fixed === "bpm" ||
                  form.bpm < 0.2 ||
                  (fixed === "rows" && form.split > 64) ||
                  (fixed === "split" && form.rows % 2 !== 0) ||
                  (fixed === "split" && form.rows < 2)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm / 2,
                    rows: fixed === "rows" ? form.rows : form.rows / 2,
                    split: fixed === "split" ? form.split : form.split * 2,
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
                  fixed === "bpm" ||
                  form.bpm > 499.5 ||
                  (fixed === "rows" && form.split % 2 !== 0) ||
                  (fixed === "rows" && form.split < 2)
                }
                fullWidth
                onClick={() =>
                  setForm({
                    bpm: form.bpm * 2,
                    rows: fixed === "rows" ? form.rows : form.rows * 2,
                    split: fixed === "split" ? form.split : form.split / 2,
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
