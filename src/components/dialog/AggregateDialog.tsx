import { useRecoilState, useRecoilValue } from "recoil";
import {
  isOpenedAggregateDialogState,
  noteSizeState,
  notesState,
} from "../../services/atoms";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Note } from "../../types/ucs";
import { NOTE_BINARIES } from "../../services/assets";

export const AggregateDialog = () => {
  const [totalCombo, setTotalCombo] = useState<number>(-1);
  const [open, setOpen] = useRecoilState<boolean>(isOpenedAggregateDialogState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);

  useEffect(() => {
    if (!open || totalCombo > -1 || notes.length === 0) return;

    // Calculate total combo which defines a number of rows containing "X", "M", "H" or "W" at least
    const combo = new Set(notes.flat().map((note) => note.rowIdx)).size;
    setTotalCombo(combo);
  }, [notes, open, totalCombo, setTotalCombo]);

  const onClose = useCallback(() => {
    setTotalCombo(-1);
    setOpen(false);
  }, [setTotalCombo, setOpen]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { maxWidth: `min(85vw, 600px)` } }}
    >
      <DialogTitle>Aggregate</DialogTitle>
      <DialogContent>
        <Grid
          columns={notes.length}
          container
          mt={1}
          alignItems="center"
          textAlign="center"
        >
          <Grid
            item
            xs={notes.length}
            mb={3}
            justifyContent="center"
            display="flex"
          >
            <Typography
              variant="h6"
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Total Combo:
              <Box ml={2}>
                {totalCombo === -1 ? (
                  <Skeleton width={`${noteSize}px`} />
                ) : (
                  totalCombo
                )}
              </Box>
            </Typography>
          </Grid>
          {[...Array(notes.length)].map((_, column: number) => (
            <Grid item xs={1} key={column}>
              <img
                src={NOTE_BINARIES[column % 5]}
                alt={`note${column % 5}`}
                width={`${noteSize}px`}
                height={`${noteSize}px`}
              />
            </Grid>
          ))}
          {[...Array(notes.length)].map((_, column: number) => (
            <Grid item xs={1} key={column}>
              {totalCombo === -1 ? (
                <Skeleton width={`${noteSize}px`} />
              ) : (
                <Typography>{notes[column].length}</Typography>
              )}
            </Grid>
          ))}
          {[...Array(notes.length)].map((_, column: number) => (
            <Grid item xs={1} key={column}>
              {totalCombo === -1 ? (
                <Skeleton width={`${noteSize}px`} />
              ) : (
                <Typography variant="caption">
                  {Math.round((1000 * notes[column].length) / totalCombo) / 10}%
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
