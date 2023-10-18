import { Button, Stack, Typography } from "@mui/material";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import { useSetRecoilState } from "recoil";
import { isOpenedNewUCSDialogState } from "../../service/atoms";
import { MENU_BAR_HEIGHT } from "../../service/styles";

function ReadyUCS() {
  const setIsOpenedNewUCSDialog = useSetRecoilState<boolean>(
    isOpenedNewUCSDialogState
  );

  const { isUploadingUCS, onUploadUCS } = useUploadingUCS();

  return (
    <Stack
      alignItems="center"
      display="flex"
      height={`calc(100vh - ${MENU_BAR_HEIGHT}px)`}
      justifyContent="center"
      ml={`${MENU_BAR_HEIGHT}px`}
      spacing={3}
      sx={{ flexGrow: 1 }}
    >
      <Button
        disabled={isUploadingUCS}
        onClick={() => setIsOpenedNewUCSDialog(true)}
        variant="contained"
      >
        New UCS
      </Button>
      <Typography>or</Typography>
      <Button disabled={isUploadingUCS} component="label" variant="contained">
        {isUploadingUCS ? "Ready..." : "Upload UCS"}
        <input
          accept=".ucs"
          onChange={onUploadUCS}
          style={{ display: "none" }}
          type="file"
        />
      </Button>
    </Stack>
  );
}

export default ReadyUCS;
