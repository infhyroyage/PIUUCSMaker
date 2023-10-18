import { memo } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { isOpenedMenuDrawerState } from "../../service/atoms";
import { MenuDrawerUploadListItemProps } from "../../types/props";
import { MENU_BAR_HEIGHT } from "../../service/styles";

function MenuDrawerUploadListItem({
  disabled,
  extension,
  icon,
  id,
  label,
  onChange,
}: MenuDrawerUploadListItemProps) {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return (
    <Tooltip placement="right" title={label}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component="label"
          disabled={disabled}
          htmlFor={id}
          sx={{
            justifyContent: isOpenedMenuDrawer ? "initial" : "center",
            minHeight: `${MENU_BAR_HEIGHT}px`,
            px: "11.6px",
          }}
        >
          <input
            id={id}
            type="file"
            accept={extension}
            style={{ display: "none" }}
            onChange={onChange}
          />
          <ListItemIcon
            sx={{
              justifyContent: "center",
              minWidth: 0,
              mr: isOpenedMenuDrawer ? 3 : "auto",
            }}
          >
            {icon}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary={label} sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}

export default memo(MenuDrawerUploadListItem);
