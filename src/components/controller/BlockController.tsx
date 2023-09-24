import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note, Zoom } from "../../types/chart";
import {
  blocksState,
  editBlockDialogFormState,
  noteSizeState,
  notesState,
  zoomState,
} from "../../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../../service/zoom";
import { EditBlockDialogForm } from "../../types/form";
import { useCallback } from "react";
import BlockControllerMenu from "./BlockControllerMenu";

function BlockController() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setEditBlockDialogForm = useSetRecoilState<EditBlockDialogForm>(
    editBlockDialogFormState
  );

  const handleAdd = useCallback(
    (blockIdx: number) => {
      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks.push(blocks[blockIdx]);
      setBlocks(updatedBlocks);
    },
    [blocks]
  );

  const handleEdit = useCallback(
    (blockIdx: number) =>
      setEditBlockDialogForm({
        beat: `${blocks[blockIdx].beat}`,
        blockIdx,
        bpm: `${blocks[blockIdx].bpm}`,
        delay: `${blocks[blockIdx].delay}`,
        open: true,
        split: `${blocks[blockIdx].split}`,
      }),
    [blocks]
  );

  const handleDelete = useCallback(
    (blockIdx: number) => {
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
    [blocks, notes, setBlocks, setNotes]
  );

  const handleMergeAbove = useCallback(
    (blockIdx: number) => {
      // 1つ前の譜面のブロックの行数を吸収
      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks[blockIdx].length += blocks[blockIdx - 1].length;
      updatedBlocks[blockIdx].accumulatedLength -= blocks[blockIdx - 1].length;

      // 1つ前の譜面のブロックの削除
      setBlocks(updatedBlocks.filter((_, idx: number) => idx !== blockIdx - 1));
    },
    [blocks]
  );

  const handleMergeBelow = useCallback(
    (blockIdx: number) => {
      // 1つ後の譜面のブロックの行数を吸収
      const updatedBlocks: Block[] = [...blocks];
      updatedBlocks[blockIdx].length += blocks[blockIdx + 1].length;
      updatedBlocks[blockIdx].accumulatedLength -= blocks[blockIdx + 1].length;

      // 1つ後の譜面のブロックの削除
      setBlocks(updatedBlocks.filter((_, idx: number) => idx !== blockIdx + 1));
    },
    [blocks]
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
        isDisabledDelete={blocks.length < 2}
        handler={{
          add: handleAdd,
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
