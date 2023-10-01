import { memo, useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  blocksState,
  noteSizeState,
  rectangleIdentifierWidthState,
  zoomState,
} from "../../service/atoms";
import { ChartSelectorProps } from "../../types/props";
import { Block } from "../../types/chart";
import { Zoom } from "../../types/ui";
import { ZOOM_VALUES } from "../../service/zoom";

function ChartSelector({ cords }: ChartSelectorProps) {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );
  const zoom = useRecoilValue<Zoom>(zoomState);

  const theme: Theme = useTheme();

  // 縦の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  // 選択領域の入力開始時のマウスの座標でのtop値を計算
  const mouseDownTop = useMemo(() => {
    let top: number = 0;
    for (const block of blocks) {
      // 譜面のブロックの1行あたりの高さ(px単位)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;
      if (cords.mouseDownRowIdx < block.accumulatedLength + block.length) {
        top +=
          unitRowHeight * (cords.mouseDownRowIdx - block.accumulatedLength);
        break;
      } else {
        top += unitRowHeight * block.length;
      }
    }
    return top;
  }, [blocks, cords.mouseDownRowIdx, noteSize, zoom.idx]);

  // 選択領域の入力時/入力終了時のマウスの座標でのtop値を計算
  // 選択領域の入力時にマウスの座標が譜面から外れた場合はnullとして計算する
  const mouseUpTop = useMemo(() => {
    if (cords.mouseUpRowIdx === null) return null;

    let top: number = 0;
    for (const block of blocks) {
      // 譜面のブロックの1行あたりの高さ(px単位)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;
      if (cords.mouseUpRowIdx < block.accumulatedLength + block.length) {
        top += unitRowHeight * (cords.mouseUpRowIdx - block.accumulatedLength);
        break;
      } else {
        top += unitRowHeight * block.length;
      }
    }
    return top;
  }, [blocks, cords.mouseUpRowIdx, noteSize, zoom.idx]);

  return (
    cords.mouseUpColumn !== null &&
    mouseUpTop !== null && (
      <span
        style={{
          position: "absolute",
          top: Math.min(mouseDownTop, mouseUpTop),
          left:
            rectangleIdentifierWidth +
            verticalBorderSize * 0.5 +
            noteSize * Math.min(cords.mouseDownColumn, cords.mouseUpColumn),
          width:
            noteSize *
            (Math.max(cords.mouseDownColumn, cords.mouseUpColumn) +
              1 -
              Math.min(cords.mouseDownColumn, cords.mouseUpColumn)),
          height:
            Math.max(mouseDownTop, mouseUpTop) +
            noteSize -
            Math.min(mouseDownTop, mouseUpTop),
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: theme.zIndex.drawer - 5,
        }}
      />
    )
  );
}

export default memo(ChartSelector);
