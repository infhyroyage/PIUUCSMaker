import { memo } from "react";
import { MenuDrawerListItemProps } from "../../types/props";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { isOpenedMenuDrawerState } from "../../service/atoms";
import { MENU_BAR_HEIGHT } from "../../service/styles";

function MenuDrawerListItem({
  disabled,
  icon,
  label,
  onClick,
}: MenuDrawerListItemProps) {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return isOpenedMenuDrawer ? (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        disabled={disabled}
        onClick={onClick}
        sx={{
          justifyContent: "initial",
          minHeight: `${MENU_BAR_HEIGHT}px`,
          px: "11.6px",
        }}
      >
        <ListItemIcon sx={{ justifyContent: "center", minWidth: 0, mr: 3 }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ opacity: 1 }} />
      </ListItemButton>
    </ListItem>
  ) : (
    <Tooltip placement="right" title={label}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={disabled}
          onClick={onClick}
          sx={{
            justifyContent: "center",
            minHeight: `${MENU_BAR_HEIGHT}px`,
            px: "11.6px",
          }}
        >
          <ListItemIcon
            sx={{ justifyContent: "center", minWidth: 0, mr: "auto" }}
          >
            {icon}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}

export default memo(MenuDrawerListItem);
