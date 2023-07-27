import { Alert, Snackbar } from "@mui/material";
import { useRecoilState } from "recoil";
import { userErrorMessageState } from "../service/atoms";

function UserErrorSnackbar() {
  const [userErrorMessage, setUserErrorMessage] = useRecoilState<string>(
    userErrorMessageState
  );

  const onClose = () => setUserErrorMessage("");

  return (
    <Snackbar
      open={userErrorMessage.length > 0}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="warning"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {userErrorMessage}
      </Alert>
    </Snackbar>
  );
}

export default UserErrorSnackbar;
