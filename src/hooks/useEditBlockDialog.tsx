import { useCallback, useMemo } from "react";

export default function useEditBlockDialog() {
  const openEditBlockDialog = useCallback(() => {
    const editBlockDialog = document.getElementById("edit-block-dialog");
    if (editBlockDialog) {
      (editBlockDialog as HTMLDialogElement).showModal();
    }
  }, []);

  const closeEditBlockDialog = useCallback(() => {
    const editBlockDialog = document.getElementById("edit-block-dialog");
    if (editBlockDialog) {
      (editBlockDialog as HTMLDialogElement).close();
    }
  }, []);

  const isOpenedEditBlockDialog = useMemo(() => {
    const editBlockDialog = document.getElementById("edit-block-dialog");
    if (editBlockDialog) {
      return (editBlockDialog as HTMLDialogElement).open;
    } else {
      return false;
    }
  }, []);

  return { openEditBlockDialog, closeEditBlockDialog, isOpenedEditBlockDialog };
}
