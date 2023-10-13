import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Block } from "../../types/chart";
import {
  blocksState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";
import RectangleBlockIdentifier from "./RectangleBlockIdentifier";

function RectangleIdentifier() {
  const [rectangleIdentifierWidth, setRectangleIdentifierWidth] =
    useRecoilState<number>(rectangleIdentifierWidthState);
  const blocks = useRecoilValue<Block[]>(blocksState);

  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
      const updatedRectangleIdentifierWidth: number =
        divRef.current.getBoundingClientRect().width;
      if (updatedRectangleIdentifierWidth !== rectangleIdentifierWidth)
        setRectangleIdentifierWidth(updatedRectangleIdentifierWidth);
    }
  }, [blocks, rectangleIdentifierWidth, setRectangleIdentifierWidth]);

  return (
    <div ref={divRef} style={{ userSelect: "none" }}>
      {blocks.map((block: Block, blockIdx: number) => (
        <RectangleBlockIdentifier
          key={blockIdx}
          beat={block.beat}
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
          rows={block.rows}
          split={block.split}
        />
      ))}
    </div>
  );
}

export default RectangleIdentifier;
