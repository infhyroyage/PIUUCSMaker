import React from "react";
import { useRecoilValue } from "recoil";
import { Block, Zoom } from "../types/chart";
import { ZOOM_VALUES } from "../service/zoom";
import { blocksState, noteSizeState, zoomState } from "../service/atoms";
import ChartBorderLine from "./ChartBorderLine";
import { Paper, Typography } from "@mui/material";

function RectangleIdentifiers() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  return (
    <div>
      {blocks.map((block: Block, blockIdx: number) => {
        // 譜面のブロックの1行あたりの高さ(px単位)を計算
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
        // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
        const borderSize: number = Math.min(
          noteSize > 20 ? Math.floor(noteSize / 20) : 1,
          unitRowHeight * block.length
        );

        // ChartRectangleの個数
        const rectangleLength = Math.ceil(
          block.length / (block.beat * block.split)
        );
        // 譜面のブロックの高さ(px単位)
        // 譜面のブロックごとに分割する枠線を最下部に配置するため、その枠線の高さ分をあらかじめ減算しておく
        let blockHeight =
          unitRowHeight * block.length -
          (blockIdx === blocks.length - 1 ? 0 : borderSize);
        // 各ChartRectangleの高さ(px単位)を枠線の配置を考慮して計算
        const rectangleHeights = [...Array(rectangleLength)].reduce(
          (prev: number[], _, rectangleIdx: number) => {
            if (blockHeight > 0) {
              // 譜面のブロック内の節ごとに分割する枠線を配置するため、その枠線の高さ分をあらかじめ減算しておく
              const rectangleHeight: number =
                unitRowHeight * block.beat * block.split -
                (rectangleIdx === rectangleLength - 1 ? 0 : borderSize);

              prev.push(Math.min(rectangleHeight, blockHeight));
              blockHeight -= unitRowHeight * block.beat * block.split;
            }
            return prev;
          },
          []
        );

        return (
          <React.Fragment key={blockIdx}>
            {rectangleHeights.map(
              (rectangleHeight: number, rectangleIdx: number) => (
                <React.Fragment key={rectangleIdx}>
                  <Paper square sx={{ height: rectangleHeight }}>
                    <Typography p={1} variant="caption">
                      {`${blockIdx + 1}:${rectangleIdx + 1}`}
                    </Typography>
                  </Paper>
                  {/* 譜面のブロック内の節ごとに分割する枠線 */}
                  {rectangleIdx < rectangleHeights.length - 1 && (
                    <ChartBorderLine width="100%" height={borderSize} />
                  )}
                </React.Fragment>
              )
            )}
            {/* 譜面のブロックごとに分割する枠線 */}
            {blockIdx < blocks.length - 1 && (
              <ChartBorderLine width="100%" height={borderSize} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default RectangleIdentifiers;
