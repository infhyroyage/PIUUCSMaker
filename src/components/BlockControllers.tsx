import { useRecoilValue } from "recoil";
import { Block, Zoom } from "../types/chart";
import { blocksState, noteSizeState, zoomState } from "../service/atoms";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { ZOOM_VALUES } from "../service/zoom";
import ChartBorderLine from "./ChartBorderLine";
import React, { useCallback } from "react";

function BlockControllers() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  const onClick = useCallback(() => {
    alert("TODO");
  }, []);

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

        return (
          <React.Fragment key={blockIdx}>
            <Card>
              <CardActionArea onClick={onClick}>
                <CardContent
                  sx={{
                    height:
                      unitRowHeight * block.length -
                      (blockIdx < blocks.length - 1 ? borderSize : 0),
                    padding: 0,
                  }}
                >
                  <Stack spacing={1} p={1}>
                    <Typography variant="caption">{`${block.bpm}BPM, 1/${block.split}`}</Typography>
                    <Typography variant="caption">{`Delay: ${block.delay}(ms)`}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
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

export default BlockControllers;
