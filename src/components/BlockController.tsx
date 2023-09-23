import { useRecoilValue } from "recoil";
import { Block, Zoom } from "../types/chart";
import { blocksState, noteSizeState, zoomState } from "../service/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../service/zoom";

function BlockController() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  return (
    <div>
      {blocks.map((block: Block, blockIdx: number) => (
        <BlockControllerButton
          key={blockIdx}
          blockHeight={
            (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.length) /
            block.split
          }
          bpm={block.bpm}
          delay={block.delay}
          isLastBlock={blockIdx === blocks.length - 1}
          split={block.split}
        />
      ))}
    </div>
  );
}

export default BlockController;
