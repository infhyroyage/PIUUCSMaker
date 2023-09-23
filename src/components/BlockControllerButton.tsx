import { memo, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ChartBorderLine from "./ChartBorderLine";
import { BlockControllerButtonProps } from "../types/props";

function BlockControllerButton({
  blockHeight,
  bpm,
  delay,
  isLastBlock,
  split,
}: BlockControllerButtonProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize: number = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize / 20), 1), blockHeight),
    [blockHeight, length, noteSize]
  );

  const onClick = useCallback(() => {
    alert("TODO");
  }, []);

  return (
    <>
      <Card raised square>
        <CardActionArea onClick={onClick}>
          <CardContent
            sx={{
              height: blockHeight - (isLastBlock ? 0 : borderSize),
              padding: 0,
            }}
          >
            <Stack spacing={1} p={1}>
              <Typography variant="caption">{`${bpm}BPM, 1/${split}`}</Typography>
              <Typography variant="caption">{`Delay: ${delay}(ms)`}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <ChartBorderLine width="100%" height={borderSize} />}
    </>
  );
}

export default memo(BlockControllerButton);
