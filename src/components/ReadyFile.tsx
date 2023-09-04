import { Button, Stack, Typography } from "@mui/material";
import useUploadingUCS from "../hooks/useUploadingUCS";
import { useSetRecoilState } from "recoil";
import { isOpenedNewFileDialogState } from "../service/atoms";

function ReadyFile() {
  const setIsOpenedNewFileDialog = useSetRecoilState<boolean>(
    isOpenedNewFileDialogState
  );

  const { isUploadingUCS, uploadUCS } = useUploadingUCS();

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
        disabled={isUploadingUCS}
      >
        New UCS
      </Button>
      <Typography>or</Typography>
      <Button variant="contained" component="label" disabled={isUploadingUCS}>
        {isUploadingUCS ? "Ready..." : "Upload UCS"}
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={uploadUCS}
        />
      </Button>
    </Stack>
  );
}

export default ReadyFile;
