import { memo } from "react";
import { ChartVerticalProps } from "../../types/props";
import { Block, Note } from "../../types/chart";
import { useRecoilValue } from "recoil";
import { blocksState } from "../../service/atoms";
import ChartVerticalNoteImages from "./ChartVerticalNoteImages";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function ChartVertical({ blockYDists, column, notes }: ChartVerticalProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);

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
        // どの譜面のブロックにも属さない場合はChartVerticalNoteImagesのレンダリング対象外とする
        const blockIdx: number = blocks.findIndex(
          (block: Block) => note.idx < block.accumulatedLength + block.length
        );
        if (blockIdx === -1) return;

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
    </>
  );
}

export default memo(ChartVertical);
