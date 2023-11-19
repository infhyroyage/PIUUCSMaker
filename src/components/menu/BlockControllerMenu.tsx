import { useCallback, useMemo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isOpenedAdjustBlockDialogState,
  blockControllerMenuBlockIdxState,
  blockControllerMenuPositionState,
  blocksState,
  isOpenedEditBlockDialogState,
  isProtectedState,
  redoSnapshotsState,
  undoSnapshotsState,
  notesState,
} from "../../services/atoms";
import { BlockControllerMenuPosition } from "../../types/menu";
import { Block, ChartSnapshot, Note } from "../../types/ucs";

function BlockControllerMenu() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [menuBlockIdx, setMenuBlockIdx] = useRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setIsOpenedAdjustBlockDialog = useSetRecoilState<boolean>(
    isOpenedAdjustBlockDialogState
  );
  const setIsOpenedEditBlockDialog = useSetRecoilState<boolean>(
    isOpenedEditBlockDialogState
  );
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const blockNum = useMemo(() => blocks.length, [blocks.length]);

  const onClose = useCallback(() => {
    setMenuBlockIdx(null);
    setMenuPosition(undefined);
  }, [setMenuBlockIdx, setMenuPosition]);

  const onClickEdit = useCallback(() => {
    if (menuBlockIdx !== null) {
      setIsOpenedEditBlockDialog(true);
      setMenuPosition(undefined);
    }
  }, [menuBlockIdx, setIsOpenedEditBlockDialog, setMenuPosition]);

  const onClickAdjust = useCallback(() => {
    setIsOpenedAdjustBlockDialog(true);
    setMenuPosition(undefined);
  }, [setIsOpenedAdjustBlockDialog, setMenuPosition]);

  const onClickAdd = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 押下した譜面のブロックのコピーを末尾に追加
      setBlocks([
        ...blocks,
        {
          ...blocks[menuBlockIdx],
          accumulatedRows:
            blocks[blocks.length - 1].accumulatedRows +
            blocks[blocks.length - 1].rows,
        },
      ]);

      onClose();
    }
  }, [
    blocks,
    menuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClickInsert = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 押下したmenuBlockIdx番目の譜面のブロックのコピーを(menuBlockIdx + 1)番目に挿入
      setBlocks([
        ...blocks.slice(0, menuBlockIdx + 1),
        {
          ...blocks[menuBlockIdx],
          accumulatedRows:
            blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows,
        },
        ...blocks.slice(menuBlockIdx + 1).map((block: Block) => {
          return {
            ...block,
            accumulatedLength:
              block.accumulatedRows + blocks[menuBlockIdx].rows,
          };
        }),
      ]);

      // 挿入した譜面のブロックの行数分、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を移動
      setNotes(
        notes.map((ns: Note[]) =>
          ns.map((note: Note) =>
            note.rowIdx >=
            blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
              ? {
                  rowIdx: note.rowIdx + blocks[menuBlockIdx].rows,
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
    menuBlockIdx,
    notes,
    onClose,
    setBlocks,
    setIsProtected,
    setNotes,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClickMergeAbove = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 1つ前の譜面のブロックの行数を吸収
      setBlocks([
        ...blocks.slice(0, menuBlockIdx - 1),
        {
          ...blocks[menuBlockIdx],
          accumulatedRows: blocks[menuBlockIdx - 1].accumulatedRows,
          rows: blocks[menuBlockIdx - 1].rows + blocks[menuBlockIdx].rows,
        },
        ...blocks.slice(menuBlockIdx + 1),
      ]);

      onClose();
    }
  }, [
    blocks,
    menuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClickMergeBelow = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 1つ後の譜面のブロックの行数を吸収
      setBlocks([
        ...blocks.slice(0, menuBlockIdx),
        {
          ...blocks[menuBlockIdx],
          rows: blocks[menuBlockIdx].rows + blocks[menuBlockIdx + 1].rows,
        },
        ...blocks.slice(menuBlockIdx + 2),
      ]);

      onClose();
    }
  }, [
    blocks,
    menuBlockIdx,
    onClose,
    setBlocks,
    setIsProtected,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClickDelete = useCallback(() => {
    if (menuBlockIdx !== null) {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 削除する譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を削除
      setNotes(
        notes.map((ns: Note[]) =>
          ns.filter(
            (note: Note) =>
              note.rowIdx < blocks[menuBlockIdx].accumulatedRows ||
              note.rowIdx >=
                blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
          )
        )
      );

      // 譜面のブロックの削除
      setBlocks(blocks.filter((_, idx: number) => idx !== menuBlockIdx));

      onClose();
    }
  }, [
    blocks,
    menuBlockIdx,
    notes,
    onClose,
    setBlocks,
    setIsProtected,
    setNotes,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition}
      disableRestoreFocus
      onClose={onClose}
      open={!!menuPosition}
    >
      <MenuList dense>
        <MenuItem onClick={onClickEdit}>Edit</MenuItem>
        <MenuItem onClick={onClickAdjust}>Adjust Split/Rows/BPM</MenuItem>
        <Divider />
        <MenuItem onClick={onClickAdd}>Add at Bottom</MenuItem>
        <MenuItem onClick={onClickInsert}>Insert into Next</MenuItem>
        <MenuItem disabled={menuBlockIdx === 0} onClick={onClickMergeAbove}>
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={menuBlockIdx === blockNum - 1}
          onClick={onClickMergeBelow}
        >
          Merge with Below
        </MenuItem>
        <MenuItem disabled={blockNum < 2} onClick={onClickDelete}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default BlockControllerMenu;
