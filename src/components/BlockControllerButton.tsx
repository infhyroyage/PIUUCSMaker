import { MouseEvent, memo, useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
  Stack,
  Typography,
} from "@mui/material";
import ChartBorderLine from "./ChartBorderLine";
import { BlockControllerButtonProps } from "../types/props";

function BlockControllerButton({
  blockHeight,
  handleEdit,
  isLastBlock,
  textFirst,
  textSecond,
}: BlockControllerButtonProps) {
  const [anchorPosition, setAnchorPosition] = useState<
    PopoverPosition | undefined
  >(undefined);
  const noteSize = useRecoilValue<number>(noteSizeState);

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize: number = useMemo(
    () => Math.min(Math.max(Math.floor(noteSize / 20), 1), blockHeight),
    [blockHeight, noteSize]
  );

  // 押下したマウスの座標にMenuを表示
  const onClickCardActionArea = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      setAnchorPosition({
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setAnchorPosition]
  );

  // Menuを非表示
  const onCloseMenu = useCallback(
    () => setAnchorPosition(undefined),
    [setAnchorPosition]
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
      <Menu
        anchorReference={anchorPosition && "anchorPosition"}
        anchorPosition={anchorPosition}
        disableRestoreFocus
        onClose={onCloseMenu}
        open={!!anchorPosition}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              handleEdit();
              setAnchorPosition(undefined);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Adjust Beat/Split</MenuItem>
        </MenuList>
        <Divider />
        <MenuList>
          <MenuItem onClick={() => alert("TODO")}>Add at Bottom</MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Insert at Next</MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Merge with Below</MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Delete</MenuItem>
        </MenuList>
      </Menu>
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <ChartBorderLine width="100%" height={borderSize} />}
    </>
  );
}

export default memo(BlockControllerButton);
