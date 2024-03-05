import { useRecoilState } from "recoil";
import { isOpenedStatisticsDialogState } from "../../services/atoms";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

export const StatisticsDialog = () => {
  const [combo, setCombo] = useState<number>(-1);
  const [open, setOpen] = useRecoilState<boolean>(
    isOpenedStatisticsDialogState
  );

  const onClose = useCallback(() => {
    setCombo(-1);
    setOpen(false);
  }, [setCombo, setOpen]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Statistics</DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          component="div"
          display="flex"
          alignItems="center"
        >
          Total Combo:
          <div style={{ marginLeft: 5 }}>
            {combo > -1 ? combo : <Skeleton width={50} />}
          </div>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
