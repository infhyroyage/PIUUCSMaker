import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note } from "../../types/chart";
import { ChartSnapshot, Zoom } from "../../types/ui";
import {
  blocksState,
  editBlockDialogFormState,
  isProtectedState,
  noteSizeState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
  zoomState,
} from "../../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../../service/zoom";
import { EditBlockDialogForm } from "../../types/dialog";
import { useCallback } from "react";
import BlockControllerMenu from "./BlockControllerMenu";

function BlockController() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setEditBlockDialogForm = useSetRecoilState<EditBlockDialogForm>(
    editBlockDialogFormState
  );
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

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
          accumulatedLength:
            blocks[blocks.length - 1].accumulatedLength +
            blocks[blocks.length - 1].length,
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
          accumulatedLength:
            blocks[blockIdx].accumulatedLength + blocks[blockIdx].length,
        },
        ...blocks.slice(blockIdx + 1).map((block: Block) => {
          return {
            ...block,
            accumulatedLength:
              block.accumulatedLength + blocks[blockIdx].length,
          };
        }),
      ]);

      // 挿入した譜面のブロックの行数分、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を移動
      setNotes(
        notes.map((ns: Note[]) =>
          ns.map((note: Note) =>
            note.idx >=
            blocks[blockIdx].accumulatedLength + blocks[blockIdx].length
              ? { idx: note.idx + blocks[blockIdx].length, type: note.type }
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
    (blockIdx: number) =>
      setEditBlockDialogForm({
        beat: `${blocks[blockIdx].beat}`,
        blockIdx,
        bpm: `${blocks[blockIdx].bpm}`,
        delay: `${blocks[blockIdx].delay}`,
        open: true,
        rows: `${blocks[blockIdx].length}`,
        split: `${blocks[blockIdx].split}`,
      }),
    [blocks, setEditBlockDialogForm]
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
              note.idx < blocks[blockIdx].accumulatedLength ||
              note.idx >=
                blocks[blockIdx].accumulatedLength + blocks[blockIdx].length
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
          accumulatedLength: blocks[blockIdx - 1].accumulatedLength,
          length: blocks[blockIdx - 1].length + blocks[blockIdx].length,
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
          length: blocks[blockIdx].length + blocks[blockIdx + 1].length,
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
    <div>
      {blocks.map((block: Block, blockIdx: number) => (
        <BlockControllerButton
          key={blockIdx}
          blockHeight={
            (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.length) /
            block.split
          }
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
          textFirst={`${block.bpm}BPM, 1/${block.split}`}
          textSecond={`Delay: ${block.delay}(ms)`}
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
