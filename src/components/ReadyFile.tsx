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
      alignItems="center"
      display="flex"
      height="100vh"
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
