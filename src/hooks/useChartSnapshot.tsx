import { useCallback } from "react";
import { ChartSnapshot } from "../types/ucs";
import useEditBlockDialog from "./useEditBlockDialog";
import useNewUcsDialog from "./useNewUcsDialog";
import { useStore } from "./useStore";

function useChartSnapshot() {
  const {
    resetBlockControllerMenuPosition,
    blocks,
    setBlocks,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setIsProtected,
    notes,
    setNotes,
    redoSnapshots,
    pushRedoSnapshot,
    popRedoSnapshot,
    hideSelector,
    undoSnapshots,
    pushUndoSnapshot,
    popUndoSnapshot,
  } = useStore();

  const { isOpenedNewUCSDialog } = useNewUcsDialog();
  const { isOpenedEditBlockDialog } = useEditBlockDialog();

  const handleRedo = useCallback(() => {
    // NOP if no redo snapshots exist or a dialog is open
    if (
      redoSnapshots.length === 0 ||
      isOpenedNewUCSDialog ||
      isOpenedEditBlockDialog
    )
      return;

    setIsProtected(true);

    // Update a set of undo/redo snapshots
    const snapshot: ChartSnapshot = popRedoSnapshot();
    pushUndoSnapshot({
      blocks: snapshot.blocks && blocks,
      notes: snapshot.notes && notes,
    });

    // Hide the indicator, selection area and menus
    resetIndicator();
    hideSelector();
    resetBlockControllerMenuPosition();
    resetChartIndicatorMenuPosition();

    // Redo the chart block and single note, starting point of hold, setting point of hold or end point of hold
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    blocks,
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    notes,
    redoSnapshots,
    resetBlockControllerMenuPosition,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setBlocks,
    setIsProtected,
    setNotes,
    popRedoSnapshot,
    hideSelector,
    pushUndoSnapshot,
  ]);

  const handleUndo = useCallback(() => {
    // NOP if no undo snapshots exist or a dialog is open
    if (
      undoSnapshots.length === 0 ||
      isOpenedNewUCSDialog ||
      isOpenedEditBlockDialog
    )
      return;

    // Do not prevent exit during editing only when undo becomes unavailable after this
    setIsProtected(undoSnapshots.length !== 1);

    // Update a set of redo snapshots and a set of undo snapshots
    const snapshot: ChartSnapshot = popUndoSnapshot();
    pushRedoSnapshot({
      blocks: snapshot.blocks && blocks,
      notes: snapshot.notes && notes,
    });

    // Hide the indicator, selection area and menus
    resetIndicator();
    hideSelector();
    resetBlockControllerMenuPosition();
    resetChartIndicatorMenuPosition();

    // Undo the chart block and single note, starting point of hold, setting point of hold or end point of hold
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    blocks,
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    notes,
    undoSnapshots,
    resetBlockControllerMenuPosition,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setBlocks,
    setIsProtected,
    setNotes,
    pushRedoSnapshot,
    hideSelector,
    popUndoSnapshot,
  ]);

  return { handleRedo, handleUndo };
}

export default useChartSnapshot;
