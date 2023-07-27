import { Alert, Snackbar } from "@mui/material";
import { useRecoilState } from "recoil";
import { isShownSystemErrorSnackbarState } from "../service/atoms";

function SystemErrorSnackbar() {
  const [isShownSystemErrorSnackbar, setIsShownSystemErrorSnackbar] =
    useRecoilState<boolean>(isShownSystemErrorSnackbarState);

  const onClose = () =>
    setIsShownSystemErrorSnackbar(!isShownSystemErrorSnackbar);

  return (
    <Snackbar
      open={isShownSystemErrorSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="error"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        システムエラーが発生しました
      </Alert>
    </Snackbar>
  );
}

export default SystemErrorSnackbar;
