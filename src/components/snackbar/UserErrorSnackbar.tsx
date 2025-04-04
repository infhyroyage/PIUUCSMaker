import { useEffect, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { SNACKBAR_Z_INDEX } from "../../services/styles";

function UserErrorSnackbar() {
  const { userErrorMessage } = useStore();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const onClose = () => setIsOpened(false);

  useEffect(() => {
    if (userErrorMessage.length > 0) {
      setIsOpened(true);
    }
  }, [userErrorMessage, setIsOpened]);

  return (
    isOpened && (
      <div
        className="toast toast-top toast-center"
        style={{ zIndex: SNACKBAR_Z_INDEX }}
      >
        <div className="alert alert-error flex flex-row">
          {userErrorMessage}
          {/* heroicons "x-mark" */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            onClick={onClose}
            style={{ cursor: "pointer" }}
            data-testid="user-error-snackbar-close"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    )
  );
}

export default UserErrorSnackbar;
