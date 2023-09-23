import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note, Zoom } from "../types/chart";
import {
  blocksState,
  editBlockDialogFormState,
  noteSizeState,
  notesState,
  zoomState,
} from "../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../service/zoom";
import { EditBlockDialogForm } from "../types/form";

function BlockController() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setEditBlockDialogForm = useSetRecoilState<EditBlockDialogForm>(
    editBlockDialogFormState
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
          handleDelete={
            blocks.length === 1
              ? null
              : () => {
                  // 削除する譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を削除
                  setNotes(
                    notes.map((ns: Note[]) =>
                      ns.filter(
                        (note: Note) =>
                          note.idx < block.accumulatedLength ||
                          note.idx >= block.accumulatedLength + block.length
                      )
                    )
                  );
                  // 譜面のブロックの削除
                  setBlocks(
                    blocks.filter((_, idx: number) => idx !== blockIdx)
                  );
                }
          }
          handleEdit={() =>
            setEditBlockDialogForm({
              beat: `${block.beat}`,
              blockIdx,
              bpm: `${block.bpm}`,
              delay: `${block.delay}`,
              open: true,
              split: `${block.split}`,
            })
          }
          isLastBlock={blockIdx === blocks.length - 1}
          textFirst={`${block.bpm}BPM, 1/${block.split}`}
          textSecond={`Delay: ${block.delay}(ms)`}
        />
      ))}
    </div>
  );
}

export default BlockController;
