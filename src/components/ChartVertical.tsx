import { memo } from "react";
import { ChartVerticalProps } from "../types/props";
import { Block, Note } from "../types/chart";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  isShownSystemErrorSnackbarState,
  menuBarHeightState,
} from "../service/atoms";
import ChartIndicator from "./ChartIndicator";
import ChartVerticalNoteImages from "./ChartVerticalNoteImages";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function ChartVertical({
  blockYDists,
  column,
  indicator,
  mouseDown,
  notes,
  unitRowHeights,
}: ChartVerticalProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  return (
    <>
      {blocks.map((block: Block, blockIdx: number) => (
        <ChartVerticalRectangles
          key={blockIdx}
          blockHeight={unitRowHeights[blockIdx] * block.length}
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
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
            column={column}
            idx={note.idx}
            type={note.type}
            unitRowHeight={unitRowHeights[blockIdx]}
            y={
              menuBarHeight +
              blockYDists[blockIdx] +
              unitRowHeights[blockIdx] *
                (note.idx - blocks[blockIdx].accumulatedLength)
            }
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
