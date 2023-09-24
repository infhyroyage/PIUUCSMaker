import { MouseEvent, memo, useCallback, useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blockControllerMenuPositionState,
  noteSizeState,
} from "../../service/atoms";
import {
  Card,
  CardActionArea,
  CardContent,
  PopoverPosition,
  Stack,
  Typography,
} from "@mui/material";
import BorderLine from "../BorderLine";
import { BlockControllerButtonProps } from "../../types/props";
import BlockControllerMenu from "./BlockControllerMenu";

function BlockControllerButton({
  blockHeight,
  blockIdx,
  isDisabledDelete,
  isLastBlock,
  handler,
  textFirst,
  textSecond,
}: BlockControllerButtonProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const setPosition = useSetRecoilState<PopoverPosition | undefined>(
    blockControllerMenuPositionState
  );

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize: number = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize / 20), 1), blockHeight),
    [blockHeight, noteSize]
  );

  // 押下したマウスの座標にBlockControllerMenuを表示
  const onClickCardActionArea = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      event.preventDefault();
      setPosition({
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setPosition]
  );

  return (
    <>
      <Card raised square>
        <CardActionArea onClick={onClickCardActionArea}>
          <CardContent
            sx={{
              height: blockHeight - (isLastBlock ? 0 : borderSize),
              padding: 0,
            }}
          >
            <Stack spacing={1} p={1}>
              <Typography variant="caption">{textFirst}</Typography>
              <Typography variant="caption">{textSecond}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <BlockControllerMenu
        blockIdx={blockIdx}
        isDisabledDelete={isDisabledDelete}
        handler={handler}
      />
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <BorderLine width="100%" height={borderSize} />}
    </>
  );
}

export default memo(BlockControllerButton);
