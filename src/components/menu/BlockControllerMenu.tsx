import { memo, useMemo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isOpenedAdjustBlockDialogState,
  blockControllerMenuBlockIdxState,
  blockControllerMenuPositionState,
  blocksState,
} from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import { BlockControllerMenuPosition } from "../../types/menu";
import { Block } from "../../types/ucs";

function BlockControllerMenu({ handler }: BlockControllerMenuProps) {
  const [menuBlockIdx, setMenuBlockIdx] = useRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const blocks = useRecoilValue<Block[]>(blocksState);
  const setIsOpenedAdjustBlockDialog = useSetRecoilState<boolean>(
    isOpenedAdjustBlockDialogState
  );

  const blockNum = useMemo(() => blocks.length, [blocks.length]);

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition}
      disableRestoreFocus
      onClose={() => setMenuPosition(undefined)}
      open={!!menuPosition}
    >
      <MenuList dense>
        <MenuItem
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.edit();
              setMenuPosition(undefined);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsOpenedAdjustBlockDialog(true);
            setMenuPosition(undefined);
          }}
        >
          Adjust Split/Rows/BPM
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.add(menuBlockIdx);
              setMenuBlockIdx(null);
              setMenuPosition(undefined);
            }
          }}
        >
          Add at Bottom
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.insert(menuBlockIdx);
              setMenuBlockIdx(null);
              setMenuPosition(undefined);
            }
          }}
        >
          Insert into Next
        </MenuItem>
        <MenuItem
          disabled={menuBlockIdx === 0}
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.mergeAbove(menuBlockIdx);
              setMenuBlockIdx(null);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={menuBlockIdx === blockNum - 1}
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.mergeBelow(menuBlockIdx);
              setMenuBlockIdx(null);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={blockNum < 2}
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.delete(menuBlockIdx);
              setMenuBlockIdx(null);
              setMenuPosition(undefined);
            }
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(BlockControllerMenu);
