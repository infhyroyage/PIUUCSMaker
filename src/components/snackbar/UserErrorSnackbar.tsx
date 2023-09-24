import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userErrorMessageState } from "../../service/atoms";

function UserErrorSnackbar() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const userErrorMessage = useRecoilValue<string>(userErrorMessageState);

  const onClose = () => setIsOpened(false);

  useEffect(() => {
    if (userErrorMessage.length > 0) {
      setIsOpened(true);
    }
  }, [userErrorMessage, setIsOpened]);

  return (
    <Snackbar
      open={isOpened}
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
