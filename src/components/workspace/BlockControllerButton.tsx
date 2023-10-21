import { MouseEvent, memo, useCallback, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blockControllerMenuBlockIdxState,
  blockControllerMenuPositionState,
  noteSizeState,
} from "../../service/atoms";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import BorderLine from "./BorderLine";
import { BlockControllerButtonProps } from "../../types/props";
import { BlockControllerMenuPosition } from "../../types/menu";

function BlockControllerButton({
  blockHeight,
  blockIdx,
  isLastBlock,
  textFirst,
  textSecond,
}: BlockControllerButtonProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const setMenuBlockIdx = useSetRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setMenuPosition = useSetRecoilState<BlockControllerMenuPosition>(
    blockControllerMenuPositionState
  );

  // 横の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const horizontalBorderSize = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize * 0.025) * 2, 2), blockHeight),
    [blockHeight, noteSize]
  );

  // 押下したマウスの座標にBlockControllerMenuを表示
  const onClickCardActionArea = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      setMenuBlockIdx(blockIdx);
      setMenuPosition({ top: event.clientY, left: event.clientX });
    },
    [blockIdx, setMenuBlockIdx, setMenuPosition]
  );

  return (
    <>
      <Card raised square sx={{ width: "100%" }}>
        <CardActionArea onClick={onClickCardActionArea}>
          <CardContent
            sx={{
              height: `${
                isLastBlock ? blockHeight : blockHeight - horizontalBorderSize
              }px`,
              padding: 0,
            }}
          >
            <Stack
              spacing={0}
              pt={0}
              pb={0}
              pl={{ xs: 0, sm: 1 }}
              pr={{ xs: 0, sm: 1 }}
            >
              <Typography variant="caption">{textFirst}</Typography>
              <Typography variant="caption">{textSecond}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && (
        <BorderLine
          style={{ height: `${horizontalBorderSize}px`, width: "100%" }}
        />
      )}
    </>
  );
}

export default memo(BlockControllerButton);
