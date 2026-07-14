import { useCallback, useEffect, useMemo } from "react";
import useEditBlockDialog from "../../hooks/useEditBlockDialog";
import { useStore } from "../../hooks/useStore";
import { MENU_Z_INDEX } from "../../services/styles";
import { Block, Note } from "../../types/ucs";
import MenuBackground from "./MenuBackground";
import MenuItem from "./MenuItem";

function BlockControllerMenu() {
  const {
    blockControllerMenuBlockIdx,
    resetBlockControllerMenuBlockIdx,
    blockControllerMenuPosition,
    resetBlockControllerMenuPosition,
    blocks,
    setBlocks,
    setIsProtected,
    notes,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
  } = useStore();

  const { openEditBlockDialog } = useEditBlockDialog();

  const blockNum = useMemo(() => blocks.length, [blocks.length]);

  const onClose = useCallback(() => {
    resetBlockControllerMenuBlockIdx();
    resetBlockControllerMenuPosition();
  }, [resetBlockControllerMenuBlockIdx, resetBlockControllerMenuPosition]);

  const onClickEdit = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      openEditBlockDialog();
      resetBlockControllerMenuPosition();
    }
  }, [
    blockControllerMenuBlockIdx,
    openEditBlockDialog,
    resetBlockControllerMenuPosition,
  ]);

  const onClickAdjust = useCallback(() => {
    resetBlockControllerMenuPosition();
    const adjustBlockDialog = document.getElementById("adjust-block-dialog");
    if (adjustBlockDialog) {
      (adjustBlockDialog as HTMLDialogElement).showModal();
    }
  }, [resetBlockControllerMenuPosition]);

  const onClickAdd = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      // Update undo/redo snapshots
      pushUndoSnapshot({ blocks, notes: null });
      resetRedoSnapshots();

      setIsProtected(true);

      // Add a copy of the clicked chart block at bottom
      setBlocks([
        ...blocks,
        {
          ...blocks[blockControllerMenuBlockIdx],
          accumulatedRows:
            blocks[blocks.length - 1].accumulatedRows +
            blocks[blocks.length - 1].rows,
          delay: 0,
        },
      ]);

      onClose();
    }
  }, [
    blocks,
    blockControllerMenuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const onClickInsert = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      // Update undo/redo snapshots
      pushUndoSnapshot({ blocks, notes });
      resetRedoSnapshots();

      setIsProtected(true);

      // Insert a copy of the chart block at blockControllerMenuBlockIdx into the next index
      setBlocks([
        ...blocks.slice(0, blockControllerMenuBlockIdx + 1),
        {
          ...blocks[blockControllerMenuBlockIdx],
          accumulatedRows:
            blocks[blockControllerMenuBlockIdx].accumulatedRows +
            blocks[blockControllerMenuBlockIdx].rows,
          delay: 0,
        },
        ...blocks.slice(blockControllerMenuBlockIdx + 1).map((block: Block) => {
          return {
            ...block,
            accumulatedLength:
              block.accumulatedRows + blocks[blockControllerMenuBlockIdx].rows,
          };
        }),
      ]);

      // Move single note, starting point of hold, setting point of hold or end point of hold by rows of the inserted chart block
      setNotes(
        notes.map((ns: Note[]) =>
          ns.map((note: Note) =>
            note.rowIdx >=
            blocks[blockControllerMenuBlockIdx].accumulatedRows +
              blocks[blockControllerMenuBlockIdx].rows
              ? {
                  rowIdx:
                    note.rowIdx + blocks[blockControllerMenuBlockIdx].rows,
                  type: note.type,
                }
              : note
          )
        )
      );

      onClose();
    }
  }, [
    blocks,
    blockControllerMenuBlockIdx,
    notes,
    onClose,
    setBlocks,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const onClickMergeAbove = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      // Update undo/redo snapshots
      pushUndoSnapshot({ blocks, notes: null });
      resetRedoSnapshots();

      setIsProtected(true);

      // Absorb rows of the previous chart block
      setBlocks([
        ...blocks.slice(0, blockControllerMenuBlockIdx - 1),
        {
          ...blocks[blockControllerMenuBlockIdx],
          accumulatedRows:
            blocks[blockControllerMenuBlockIdx - 1].accumulatedRows,
          rows:
            blocks[blockControllerMenuBlockIdx - 1].rows +
            blocks[blockControllerMenuBlockIdx].rows,
        },
        ...blocks.slice(blockControllerMenuBlockIdx + 1),
      ]);

      onClose();
    }
  }, [
    blocks,
    blockControllerMenuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const onClickMergeBelow = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      // Update undo/redo snapshots
      pushUndoSnapshot({ blocks, notes: null });
      resetRedoSnapshots();

      setIsProtected(true);

      // Absorb rows of the next chart block
      setBlocks([
        ...blocks.slice(0, blockControllerMenuBlockIdx),
        {
          ...blocks[blockControllerMenuBlockIdx],
          rows:
            blocks[blockControllerMenuBlockIdx].rows +
            blocks[blockControllerMenuBlockIdx + 1].rows,
        },
        ...blocks.slice(blockControllerMenuBlockIdx + 2),
      ]);

      onClose();
    }
  }, [
    blocks,
    blockControllerMenuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const onClickDelete = useCallback(() => {
    if (blockControllerMenuBlockIdx !== null) {
      // Update undo/redo snapshots
      pushUndoSnapshot({ blocks, notes });
      resetRedoSnapshots();

      setIsProtected(true);

      // Delete single note, starting point of hold, setting point of hold or end point of hold included in the chart block to delete
      setNotes(
        notes.map((ns: Note[]) =>
          ns.filter(
            (note: Note) =>
              note.rowIdx <
                blocks[blockControllerMenuBlockIdx].accumulatedRows ||
              note.rowIdx >=
                blocks[blockControllerMenuBlockIdx].accumulatedRows +
                  blocks[blockControllerMenuBlockIdx].rows
          )
        )
      );

      // Delete the chart block
      setBlocks(
        blocks.filter((_, idx: number) => idx !== blockControllerMenuBlockIdx)
      );

      onClose();
    }
  }, [
    blocks,
    blockControllerMenuBlockIdx,
    notes,
    onClose,
    setBlocks,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  // Prevent manual vertical scrolling while displayed
  useEffect(() => {
    document.body.style.overflowY = blockControllerMenuPosition
      ? "hidden"
      : "scroll";
  }, [blockControllerMenuPosition]);

  return (
    blockControllerMenuPosition && (
      <>
        <MenuBackground onClose={onClose} />
        <ul
          className="menu bg-base-200 rounded-box fixed"
          style={{
            top: blockControllerMenuPosition.top,
            left: blockControllerMenuPosition.left,
            zIndex: MENU_Z_INDEX,
          }}
        >
          <MenuItem label="Edit" onClick={onClickEdit} />
          <MenuItem label="Adjust Split/Rows/BPM" onClick={onClickAdjust} />
          <div className="divider my-0" />
          <MenuItem label="Add at Bottom" onClick={onClickAdd} />
          <MenuItem label="Insert into Next" onClick={onClickInsert} />
          <MenuItem
            disabled={blockControllerMenuBlockIdx === 0}
            label="Merge with Above"
            onClick={onClickMergeAbove}
          />
          <MenuItem
            disabled={blockControllerMenuBlockIdx === blockNum - 1}
            label="Merge with Below"
            onClick={onClickMergeBelow}
          />
          <MenuItem
            disabled={blockNum < 2}
            label="Delete"
            onClick={onClickDelete}
          />
        </ul>
      </>
    )
  );
}

export default BlockControllerMenu;
