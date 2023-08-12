import { Button, Stack, Typography } from "@mui/material";
import useOpenFile from "../hooks/useOpenFile";
import { useSetRecoilState } from "recoil";
import { isOpenedNewFileDialogState } from "../service/atoms";

function ReadyFile() {
  const setIsOpenedNewFileDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isOpeningFile, handleOpenFile } = useOpenFile();

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      spacing={3}
      sx={{ flexGrow: 1 }}
    >
      <Button
        variant="contained"
        onClick={() => setIsOpenedNewFileDialog(true)}
        disabled={isOpeningFile}
      >
        New UCS File
      </Button>
      <Typography>or</Typography>
      <Button variant="contained" component="label" disabled={isOpeningFile}>
        {isOpeningFile ? "Ready..." : "Open UCS File"}
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={handleOpenFile}
        />
      </Button>
    </Stack>
  );
}

export default ReadyFile;
