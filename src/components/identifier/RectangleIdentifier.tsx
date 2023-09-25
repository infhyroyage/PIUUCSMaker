import { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Block } from "../../types/chart";
import {
  blocksState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";
import RectangleBlockIdentifier from "./RectangleBlockIdentifier";

function RectangleIdentifier() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const setRectangleIdentifierWidth = useSetRecoilState<number>(
    rectangleIdentifierWidthState
  );

  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
      setRectangleIdentifierWidth(divRef.current.getBoundingClientRect().width);
    }
  }, [setRectangleIdentifierWidth]);

  return (
    <div ref={divRef}>
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
