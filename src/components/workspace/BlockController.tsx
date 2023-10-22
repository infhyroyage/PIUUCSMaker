import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note } from "../../types/ucs";
import { Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import {
  blocksState,
  columnsState,
  isOpenedEditBlockDialogState,
  isProtectedState,
  noteSizeState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
  zoomState,
} from "../../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../../service/zoom";
import { useCallback, useMemo } from "react";
import BlockControllerMenu from "../menu/BlockControllerMenu";
import { IDENTIFIER_WIDTH, MENU_BAR_HEIGHT } from "../../service/styles";

function BlockController() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const columns = useRecoilValue<number>(columnsState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setIsOpenedEditBlockDialog = useSetRecoilState<boolean>(
    isOpenedEditBlockDialogState
  );
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  const handleAdd = useCallback(
    (blockIdx: number) => {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 押下した譜面のブロックのコピーを末尾に追加
      setBlocks([
        ...blocks,
        {
          ...blocks[blockIdx],
          accumulatedRows:
            blocks[blocks.length - 1].accumulatedRows +
            blocks[blocks.length - 1].rows,
        },
      ]);
    },
    [
      blocks,
      setBlocks,
      setIsProtected,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  const handleInsert = useCallback(
    (blockIdx: number) => {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 押下したblockIdx番目の譜面のブロックのコピーを(blockIdx + 1)番目に挿入
      setBlocks([
        ...blocks.slice(0, blockIdx + 1),
        {
          ...blocks[blockIdx],
          accumulatedRows:
            blocks[blockIdx].accumulatedRows + blocks[blockIdx].rows,
        },
        ...blocks.slice(blockIdx + 1).map((block: Block) => {
          return {
            ...block,
            accumulatedLength: block.accumulatedRows + blocks[blockIdx].rows,
          };
        }),
      ]);

      // 挿入した譜面のブロックの行数分、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を移動
      setNotes(
        notes.map((ns: Note[]) =>
          ns.map((note: Note) =>
            note.rowIdx >=
            blocks[blockIdx].accumulatedRows + blocks[blockIdx].rows
              ? { rowIdx: note.rowIdx + blocks[blockIdx].rows, type: note.type }
              : note
          )
        )
      );
    },
    [
      blocks,
      notes,
      setBlocks,
      setIsProtected,
      setNotes,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  const handleEdit = useCallback(
    () => setIsOpenedEditBlockDialog(true),
    [setIsOpenedEditBlockDialog]
  );

  const handleDelete = useCallback(
    (blockIdx: number) => {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 削除する譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を削除
      setNotes(
        notes.map((ns: Note[]) =>
          ns.filter(
            (note: Note) =>
              note.rowIdx < blocks[blockIdx].accumulatedRows ||
              note.rowIdx >=
                blocks[blockIdx].accumulatedRows + blocks[blockIdx].rows
          )
        )
      );

      // 譜面のブロックの削除
      setBlocks(blocks.filter((_, idx: number) => idx !== blockIdx));
    },
    [
      blocks,
      notes,
      setBlocks,
      setIsProtected,
      setNotes,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  const handleMergeAbove = useCallback(
    (blockIdx: number) => {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 1つ前の譜面のブロックの行数を吸収
      setBlocks([
        ...blocks.slice(0, blockIdx - 1),
        {
          ...blocks[blockIdx],
          accumulatedRows: blocks[blockIdx - 1].accumulatedRows,
          rows: blocks[blockIdx - 1].rows + blocks[blockIdx].rows,
        },
        ...blocks.slice(blockIdx + 1),
      ]);
    },
    [
      blocks,
      setBlocks,
      setIsProtected,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  const handleMergeBelow = useCallback(
    (blockIdx: number) => {
      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 1つ後の譜面のブロックの行数を吸収
      setBlocks([
        ...blocks.slice(0, blockIdx),
        {
          ...blocks[blockIdx],
          rows: blocks[blockIdx].rows + blocks[blockIdx + 1].rows,
        },
        ...blocks.slice(blockIdx + 2),
      ]);
    },
    [
      blocks,
      setBlocks,
      setIsProtected,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  return (
    <div
      style={{
        maxWidth: `calc(100vw - ${
          MENU_BAR_HEIGHT +
          IDENTIFIER_WIDTH +
          columns * noteSize +
          verticalBorderSize
        }px)`,
      }}
    >
      {blocks.map((block: Block, blockIdx: number) => (
        <BlockControllerButton
          key={blockIdx}
          blockHeight={
            (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.rows) / block.split
          }
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
          textFirst={`${block.bpm} BPM, 1/${block.split}`}
          textSecond={`Delay: ${block.delay} (ms)`}
        />
      ))}
      <BlockControllerMenu
        blockNum={blocks.length}
        handler={{
          add: handleAdd,
          insert: handleInsert,
          delete: handleDelete,
          edit: handleEdit,
          mergeAbove: handleMergeAbove,
          mergeBelow: handleMergeBelow,
        }}
      />
    </div>
  );
}

export default BlockController;
