import { memo } from "react";
import { ChartVerticalProps } from "../../types/props";
import { Block, Note } from "../../types/chart";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  isShownSystemErrorSnackbarState,
} from "../../service/atoms";
import ChartIndicator from "./ChartIndicator";
import ChartVerticalNoteImages from "./ChartVerticalNoteImages";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function ChartVertical({
  blockYDists,
  column,
  indicator,
  mouseDown,
  notes,
}: ChartVerticalProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  return (
    <>
      {blocks.map((block: Block, blockIdx: number) => (
        <ChartVerticalRectangles
          key={blockIdx}
          beat={block.beat}
          isEven={blockIdx % 2 === 0}
          isLastBlock={blockIdx === blocks.length - 1}
          length={block.length}
          split={block.split}
        />
      ))}
      {notes.map((note: Note, i: number) => {
        // noteが属する譜面のブロックのインデックスを取得
        const blockIdx: number = blocks.findIndex(
          (block: Block) => note.idx < block.accumulatedLength + block.length
        );
        // 内部矛盾チェック
        if (blockIdx === -1) {
          setIsShownSystemErrorSnackbar(true);
          return;
        }

        return (
          <ChartVerticalNoteImages
            key={i}
            accumulatedLength={blocks[blockIdx].accumulatedLength}
            blockYDist={blockYDists[blockIdx]}
            column={column}
            idx={note.idx}
            split={blocks[blockIdx].split}
            type={note.type}
          />
        );
      })}
      <ChartIndicator
        column={column}
        indicator={indicator}
        mouseDown={mouseDown}
      />
    </>
  );
}

export default memo(ChartVertical);
