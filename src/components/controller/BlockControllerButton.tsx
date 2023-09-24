import { MouseEvent, memo, useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../../service/atoms";
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
import BorderLine from "../BorderLine";
import { BlockControllerButtonProps } from "../../types/props";

function BlockControllerButton({
  blockHeight,
  blockIdx,
  isDisabledDelete,
  isLastBlock,
  menuHandler,
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
              menuHandler.edit(blockIdx);
              setAnchorPosition(undefined);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Resize</MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Adjust Beat/Split</MenuItem>
        </MenuList>
        <Divider />
        <MenuList>
          <MenuItem onClick={() => alert("TODO")}>Add at Bottom</MenuItem>
          <MenuItem onClick={() => alert("TODO")}>Insert into Next</MenuItem>
          <MenuItem
            disabled={blockIdx === 0}
            onClick={() => {
              menuHandler.mergeAbove(blockIdx);
              setAnchorPosition(undefined);
            }}
          >
            Merge with Above
          </MenuItem>
          <MenuItem
            disabled={blockIdx === 0}
            onClick={() => {
              menuHandler.mergeBelow(blockIdx);
              setAnchorPosition(undefined);
            }}
          >
            Merge with Below
          </MenuItem>
          <MenuItem
            disabled={isDisabledDelete}
            onClick={() => {
              menuHandler.delete(blockIdx);
              setAnchorPosition(undefined);
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <BorderLine width="100%" height={borderSize} />}
    </>
  );
}

export default memo(BlockControllerButton);
