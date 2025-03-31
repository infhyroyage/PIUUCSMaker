import { memo } from "react";
import { NAVIGATION_BAR_HEIGHT } from "../../services/styles";
import { DrawerUploadListItemProps } from "../../types/props";

function DrawerUploadListItem({
  disabled,
  extension,
  icon,
  id,
  label,
  onChange,
}: DrawerUploadListItemProps) {
  return (
    <li className={disabled ? "menu-disabled" : undefined}>
      <label
        className="flex items-center justify-start btn btn-ghost rounded-none px-3"
        htmlFor={id}
        style={{ height: `${NAVIGATION_BAR_HEIGHT}px` }}
      >
        <input
          id={id}
          type="file"
          accept={extension}
          style={{ display: "none" }}
          onChange={onChange}
          disabled={disabled}
        />
        {icon}
        <p className="text-sm text-left w-full font-normal pl-3">{label}</p>
      </label>
    </li>
  );
}

export default memo(DrawerUploadListItem);
