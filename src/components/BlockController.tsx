import { useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Zoom } from "../types/chart";
import {
  blocksState,
  editBlockDialogFormState,
  noteSizeState,
  zoomState,
} from "../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../service/zoom";
import { EditBlockDialogForm } from "../types/form";

function BlockController() {
  const blocks = useRecoilValue<Block[]>(blocksState);
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
