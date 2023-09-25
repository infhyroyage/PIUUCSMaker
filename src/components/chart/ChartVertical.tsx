import { memo, useCallback } from "react";
import { ChartVerticalProps } from "../../types/props";
import { Block, Indicator, Note } from "../../types/chart";
import { useRecoilState } from "recoil";
import { blocksState } from "../../service/atoms";
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
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);

  const handleSplit = useCallback(
    (indicator: Indicator) => {
      // インディケーターが非表示の場合はNOP
      if (indicator === null) return;

      // blockIdx番目の譜面のブロックを、(rowIdx- 1)番目以前とrowIdx番目とで分割
      setBlocks([
        ...blocks.slice(0, indicator.blockIdx),
        {
          ...blocks[indicator.blockIdx],
          length: indicator.rowIdx - indicator.blockAccumulatedLength,
        },
        {
          ...blocks[indicator.blockIdx],
          accumulatedLength: indicator.rowIdx,
          length:
            blocks[indicator.blockIdx].length +
            indicator.blockAccumulatedLength -
            indicator.rowIdx,
        },
        ...blocks.slice(indicator.blockIdx + 1),
      ]);
    },
    [blocks, setBlocks]
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
      <ChartIndicator
        column={column}
        handler={{
          split: handleSplit,
        }}
        indicator={indicator}
        mouseDown={mouseDown}
      />
    </>
  );
}

export default memo(ChartVertical);
