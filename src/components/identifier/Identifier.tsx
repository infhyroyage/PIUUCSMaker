import React from "react";
import { useRecoilValue } from "recoil";
import { Block } from "../../types/chart";
import { blocksState, noteSizeState, zoomState } from "../../service/atoms";
import BorderLine from "../BorderLine";
import { Zoom } from "../../types/ui";
import { ZOOM_VALUES } from "../../service/zoom";
import { Paper, Typography } from "@mui/material";
import { IDENTIFIER_WIDTH } from "../../service/styles";

function Identifier() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  return (
    <div style={{ userSelect: "none", width: `${IDENTIFIER_WIDTH}px` }}>
      {blocks.map((block: Block, blockIdx: number) => {
        // 譜面のブロックの1行あたりの高さ(px単位)
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // 横の枠線のサイズ(px単位)
        // noteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)とする
        // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
        const horizontalBorderSize: number = Math.min(
          Math.max(Math.floor(noteSize * 0.025) * 2, 2),
          unitRowHeight * block.rows
        );

        // 譜面のブロック内の節のブロックの個数
        const rectangleLength: number = Math.ceil(
          block.rows / (block.beat * block.split)
        );

        // 譜面のブロック内の各節のブロックの高さ(px単位)
        let blockHeight: number =
          unitRowHeight * block.rows -
          (blockIdx === blocks.length - 1 ? 0 : horizontalBorderSize);
        const rectangleHeights = [...Array(rectangleLength)].reduce(
          (prev: number[], _, rectangleIdx: number) => {
            if (blockHeight > 0) {
              // 譜面のブロック内の節ごとに分割する枠線を配置するため、その枠線の高さ分をあらかじめ減算しておく
              const rectangleHeight: number =
                unitRowHeight * block.beat * block.split -
                (rectangleIdx === rectangleLength - 1
                  ? 0
                  : horizontalBorderSize);

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
                  <Paper
                    square
                    sx={{ height: `${rectangleHeight}px`, textAlign: "center" }}
                  >
                    <Typography p={0} variant="caption">
                      {`${blockIdx + 1}:${rectangleIdx + 1}`}
                    </Typography>
                  </Paper>
                  {/* 譜面のブロック内の節ごとに分割する枠線 */}
                  {rectangleIdx < rectangleHeights.length - 1 && (
                    <BorderLine
                      style={{
                        height: `${horizontalBorderSize}px`,
                        width: "100%",
                      }}
                    />
                  )}
                </React.Fragment>
              )
            )}
            {/* 譜面のブロックごとに分割する枠線 */}
            {blockIdx < blocks.length - 1 && (
              <BorderLine
                style={{ height: `${horizontalBorderSize}px`, width: "100%" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Identifier;
