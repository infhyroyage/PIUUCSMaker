import { memo } from "react";
import { ListItemText, MenuItem, Typography } from "@mui/material";
import { ChartIndicatorMenuItemProps } from "../../types/props";

function ChartIndicatorMenuItem({
  disabled,
  label,
  keyLabel,
  onClick,
}: ChartIndicatorMenuItemProps) {
  return (
    <MenuItem disabled={disabled} onClick={onClick}>
      <ListItemText>{label}</ListItemText>
      {keyLabel && (
        <Typography variant="body2" color="text.secondary">
          {keyLabel}
        </Typography>
      )}
    </MenuItem>
  );
}
export default memo(ChartIndicatorMenuItem);
