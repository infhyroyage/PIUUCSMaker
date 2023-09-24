import { useRecoilValue } from "recoil";
import { Block } from "../../types/chart";
import { blocksState } from "../../service/atoms";
import RectangleBlockIdentifier from "./RectangleBlockIdentifier";

function RectangleIdentifier() {
  const blocks = useRecoilValue<Block[]>(blocksState);

  return (
    <div>
      {blocks.map((block: Block, blockIdx: number) => (
        <RectangleBlockIdentifier
          key={blockIdx}
          beat={block.beat}
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
          length={block.length}
          split={block.split}
        />
      ))}
    </div>
  );
}

export default RectangleIdentifier;
