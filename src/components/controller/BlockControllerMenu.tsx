import { memo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  adjustBlockDialogOpenState,
  blockControllerMenuBlockIdxState,
  blockControllerMenuPositionState,
} from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import { BlockControllerMenuPosition } from "../../types/ui";
import { AdjustBlockDialogOpen } from "../../types/dialog";

function BlockControllerMenu({ blockNum, handler }: BlockControllerMenuProps) {
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const menuBlockIdx = useRecoilValue<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setAdjustBlockDialogOpen = useSetRecoilState<AdjustBlockDialogOpen>(
    adjustBlockDialogOpenState
  );

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
              handler.edit(menuBlockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAdjustBlockDialogOpen({ fixed: "bpm", open: true });
            setMenuPosition(undefined);
          }}
        >
          Adjust Split & Rows
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAdjustBlockDialogOpen({ fixed: "rows", open: true });
            setMenuPosition(undefined);
          }}
        >
          Adjust Split & BPM
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (menuBlockIdx !== null) {
              handler.add(menuBlockIdx);
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
