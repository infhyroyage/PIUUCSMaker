import { memo, useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import { blocksState, noteSizeState, zoomState } from "../../services/atoms";
import { ChartSelectorProps } from "../../types/props";
import { Block } from "../../types/ucs";
import { Zoom } from "../../types/menu";
import { ZOOM_VALUES } from "../../services/assets";
import { IDENTIFIER_WIDTH } from "../../services/styles";

function ChartSelector({
  goalColumn,
  goalRowIdx,
  startColumn,
  startRowIdx,
}: ChartSelectorProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  const theme: Theme = useTheme();

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  // 選択領域の上端のtop値(px)を計算
  const startTop = useMemo(() => {
    let top: number = 0;
    blocks.some((block: Block) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (startRowIdx < block.accumulatedRows + block.rows) {
        top += unitRowHeight * (startRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, noteSize, startRowIdx, zoom.idx]);

  // 選択領域の下端のtop値(px)を計算
  const goalTop = useMemo(() => {
    let top: number = 0;
    blocks.some((block: Block) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (goalRowIdx < block.accumulatedRows + block.rows) {
        top += unitRowHeight * (goalRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, goalRowIdx, noteSize, zoom.idx]);

  return (
    <span
      style={{
        position: "absolute",
        top: `${startTop}px`,
        left: `${
          IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * startColumn
        }px`,
        width: `${noteSize * (goalColumn + 1 - startColumn)}px`,
        height: `${goalTop + noteSize - startTop}px`,
        backgroundColor: "rgba(170, 170, 170, 0.5)",
        pointerEvents: "none",
        zIndex: theme.zIndex.appBar - 5,
      }}
    />
  );
}

export default memo(ChartSelector);
