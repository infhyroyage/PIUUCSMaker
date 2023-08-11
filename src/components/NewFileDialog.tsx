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
import { useRecoilState } from "recoil";
import { isOpenedNewFileDialogState } from "../service/atoms";

function NewFileDialog() {
  const [isOpenedNewFileDialog, setIsOpenedNewFileDialog] =
    useRecoilState<boolean>(isOpenedNewFileDialogState);

  const onCreate = () => alert("TODO");

  const onClose = () => setIsOpenedNewFileDialog(false);

  return (
    <Dialog open={isOpenedNewFileDialog} onClose={onClose}>
      <DialogTitle>New UCS</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            defaultValue="CS001"
            fullWidth
            helperText="Not Set Extension(.ucs)"
            label="UCS File Name"
            margin="dense"
            size="small"
          />
          <TextField
            defaultValue="Single"
            fullWidth
            label="Mode"
            margin="dense"
            select
            size="small"
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="SinglePerformance">Single Performance</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="DoublePerformance">Double Performance</MenuItem>
          </TextField>
          <TextField
            defaultValue={120}
            fullWidth
            helperText="0.1 - 999"
            label="BPM"
            margin="dense"
            size="small"
          />
          <TextField
            defaultValue={0}
            fullWidth
            helperText="-999999 - 999999"
            label="Delay(ms)"
            margin="dense"
            size="small"
          />
          <TextField
            defaultValue={4}
            fullWidth
            helperText="1 - 64"
            label="Beat"
            margin="dense"
            size="small"
            type="number"
          />
          <TextField
            defaultValue={2}
            fullWidth
            helperText="1 - 128"
            label="Split"
            margin="dense"
            size="small"
            type="number"
          />
          <TextField
            defaultValue={50}
            fullWidth
            helperText="Over 1"
            label="Row Length"
            margin="dense"
            size="small"
            type="number"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewFileDialog;
