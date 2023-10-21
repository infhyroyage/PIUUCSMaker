import { memo, useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import { blocksState, noteSizeState, zoomState } from "../../service/atoms";
import { ChartSelectorProps } from "../../types/props";
import { Block } from "../../types/ucs";
import { Zoom } from "../../types/ui";
import { ZOOM_VALUES } from "../../service/zoom";
import { IDENTIFIER_WIDTH } from "../../service/styles";

function ChartSelector({ mouseCords }: ChartSelectorProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  const theme: Theme = useTheme();

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  // 選択領域の入力開始時のマウスの座標でのtop値(px)を計算
  const mouseDownTop = useMemo(() => {
    let top: number = 0;
    blocks.some((block: Block) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (mouseCords.mouseDownRowIdx < block.accumulatedRows + block.rows) {
        top +=
          unitRowHeight * (mouseCords.mouseDownRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, mouseCords.mouseDownRowIdx, noteSize, zoom.idx]);

  // 選択領域の入力時/入力終了時のマウスの座標でのtop値(px)を計算
  // 選択領域の入力時にマウスの座標が譜面から外れた場合はnullとして計算する
  const mouseUpTop = useMemo(() => {
    if (mouseCords.mouseUpRowIdx === null) return null;

    let top: number = 0;
    blocks.some((block: Block) => {
      if (mouseCords.mouseUpRowIdx === null) return true;

      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (mouseCords.mouseUpRowIdx < block.accumulatedRows + block.rows) {
        top +=
          unitRowHeight * (mouseCords.mouseUpRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, mouseCords.mouseUpRowIdx, noteSize, zoom.idx]);

  return (
    mouseCords.mouseUpColumn !== null &&
    mouseUpTop !== null && (
      <span
        style={{
          position: "absolute",
          top: `${Math.min(mouseDownTop, mouseUpTop)}px`,
          left: `${
            IDENTIFIER_WIDTH +
            verticalBorderSize * 0.5 +
            noteSize *
              Math.min(mouseCords.mouseDownColumn, mouseCords.mouseUpColumn)
          }px`,
          width: `${
            noteSize *
            (Math.max(mouseCords.mouseDownColumn, mouseCords.mouseUpColumn) +
              1 -
              Math.min(mouseCords.mouseDownColumn, mouseCords.mouseUpColumn))
          }px`,
          height: `${
            Math.max(mouseDownTop, mouseUpTop) +
            noteSize -
            Math.min(mouseDownTop, mouseUpTop)
          }px`,
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: theme.zIndex.appBar - 5,
        }}
      />
    )
  );
}

export default memo(ChartSelector);
