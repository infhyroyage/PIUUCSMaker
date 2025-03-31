import { memo } from "react";
import { MenuItemProps } from "../../types/props";

function MenuItem({ disabled, keyLabel, label, onClick }: MenuItemProps) {
  return (
    <li className={disabled ? "menu-disabled" : undefined}>
      <button className="flex" disabled={disabled} onClick={onClick}>
        <div className="flex-1 text-sm">{label}</div>
        <div className="flex text-xs">{keyLabel}</div>
      </button>
    </li>
  );
}
export default memo(MenuItem);
