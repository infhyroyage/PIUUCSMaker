import { memo } from "react";
import { ChartIndicatorMenuItemProps } from "../../types/props";

function ChartIndicatorMenuItem({
  disabled,
  label,
  keyLabel,
  onClick,
}: ChartIndicatorMenuItemProps) {
  return (
    <li className={disabled ? "disabled" : undefined}>
      <button className="flex" disabled={disabled} onClick={onClick}>
        <div className="flex-1 text-sm">{label}</div>
        <div className="flex text-xs">{keyLabel}</div>
      </button>
    </li>
  );
}
export default memo(ChartIndicatorMenuItem);
