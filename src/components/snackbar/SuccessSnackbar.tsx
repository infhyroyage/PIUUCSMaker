import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useRecoilValue } from "recoil";
import { successMessageState } from "../../services/atoms";

function SuccessSnackbar() {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const successMessage = useRecoilValue<string>(successMessageState);

  const onClose = () => setIsOpened(false);

  useEffect(() => {
    if (successMessage.length > 0) {
      setIsOpened(true);
    }
  }, [successMessage, setIsOpened]);

  return (
    <Snackbar
      open={isOpened}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="success"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {successMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;
