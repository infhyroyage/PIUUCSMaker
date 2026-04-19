import { useCallback, useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import { SNACKBAR_Z_INDEX } from "../../services/styles";

function SuccessSnackbar() {
  const { successMessage, setSuccessMessage } = useStore();

  const onClose = useCallback(() => setSuccessMessage(""), [setSuccessMessage]);

  useEffect(() => {
    if (successMessage.length > 0) {
      // 表示してから5秒後に自動的に非表示にする
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  return (
    successMessage.length > 0 && (
      <div
        className="toast toast-top toast-center"
        style={{ zIndex: SNACKBAR_Z_INDEX }}
      >
        <div className="alert alert-success flex flex-row">
          {successMessage}
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
            data-testid="success-snackbar-close"
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

export default SuccessSnackbar;
