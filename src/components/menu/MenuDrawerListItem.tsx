import { memo } from "react";
import { MENU_BAR_HEIGHT } from "../../services/styles";
import { MenuDrawerListItemProps } from "../../types/props";

function MenuDrawerListItem({
  disabled,
  icon,
  label,
  onClick,
}: MenuDrawerListItemProps) {
  return (
    <li>
      <button
        className="flex flex-col items-start btn btn-ghost rounded-none px-3"
        disabled={disabled}
        onClick={onClick}
        style={{ height: `${MENU_BAR_HEIGHT}px` }}
      >
        {icon}
        <p className="text-sm text-left w-full font-normal pl-3">{label}</p>
      </button>
    </li>
  );
}

export default memo(MenuDrawerListItem);
