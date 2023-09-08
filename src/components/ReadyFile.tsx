import { Button, Stack, Typography } from "@mui/material";
import useUploadingUCS from "../hooks/useUploadingUCS";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isOpenedNewFileDialogState,
  menuBarHeightState,
} from "../service/atoms";

function ReadyFile() {
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const setIsOpenedNewFileDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isUploadingUCS, uploadUCS } = useUploadingUCS();

  return (
    <Stack
      alignItems="center"
      display="flex"
      height={`calc(100vh - ${menuBarHeight}px)`}
      justifyContent="center"
      spacing={3}
      sx={{ flexGrow: 1 }}
    >
      <Button
        disabled={isUploadingUCS}
        onClick={() => setIsOpenedNewFileDialog(true)}
        variant="contained"
      >
        New UCS
      </Button>
      <Typography>or</Typography>
      <Button disabled={isUploadingUCS} component="label" variant="contained">
        {isUploadingUCS ? "Ready..." : "Upload UCS"}
        <input
          accept=".ucs"
          onChange={uploadUCS}
          style={{ display: "none" }}
          type="file"
        />
      </Button>
    </Stack>
  );
}

export default ReadyFile;
