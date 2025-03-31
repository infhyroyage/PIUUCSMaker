import { memo } from "react";
import { NAVIGATION_BAR_HEIGHT } from "../../services/styles";
import { DrawerListItemProps } from "../../types/props";

function DrawerListItem({
  disabled,
  icon,
  label,
  onClick,
}: DrawerListItemProps) {
  return (
    <li className={disabled ? "menu-disabled" : undefined}>
      <button
        className="flex items-center justify-start btn btn-ghost rounded-none px-3"
        disabled={disabled}
        onClick={onClick}
        style={{ height: `${NAVIGATION_BAR_HEIGHT}px` }}
      >
        {icon}
        <p className="text-sm text-left w-full font-normal pl-3">{label}</p>
      </button>
    </li>
  );
}

export default memo(DrawerListItem);
