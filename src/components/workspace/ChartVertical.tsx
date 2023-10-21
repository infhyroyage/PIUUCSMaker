import { memo } from "react";
import { ChartVerticalProps } from "../../types/props";
import { Block, Note } from "../../types/ucs";
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
          isEven={blockIdx % 2 === 0}
          isLastBlock={blockIdx === blocks.length - 1}
          rows={block.rows}
          split={block.split}
        />
      ))}
      {notes.map((note: Note, i: number) => {
        // noteが属する譜面のブロックのインデックスを取得
        // どの譜面のブロックにも属さない場合はChartVerticalNoteImagesのレンダリング対象外とする
        const blockIdx: number = blocks.findIndex(
          (block: Block) => note.rowIdx < block.accumulatedRows + block.rows
        );
        if (blockIdx === -1) return;

        return (
          <ChartVerticalNoteImages
            key={i}
            accumulatedRows={blocks[blockIdx].accumulatedRows}
            blockYDist={blockYDists[blockIdx]}
            column={column}
            rowIdx={note.rowIdx}
            split={blocks[blockIdx].split}
            type={note.type}
          />
        );
      })}
    </>
  );
}

export default memo(ChartVertical);
