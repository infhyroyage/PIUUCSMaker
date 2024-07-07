import { useCallback, useMemo } from "react";

export default function useNewUcsDialog() {
  const openNewUcsDialog = useCallback(() => {
    const newUcsDialog = document.getElementById("new-ucs-dialog");
    if (newUcsDialog) {
      (newUcsDialog as HTMLDialogElement).showModal();
    }
  }, []);

  const closeNewUcsDialog = useCallback(() => {
    const newUcsDialog = document.getElementById("new-ucs-dialog");
    if (newUcsDialog) {
      (newUcsDialog as HTMLDialogElement).close();
    }
  }, []);

  const isOpenedNewUCSDialog = useMemo(() => {
    const newUcsDialog = document.getElementById("new-ucs-dialog");
    if (newUcsDialog) {
      return (newUcsDialog as HTMLDialogElement).open;
    } else {
      return false;
    }
  }, []);

  return { openNewUcsDialog, closeNewUcsDialog, isOpenedNewUCSDialog };
}
