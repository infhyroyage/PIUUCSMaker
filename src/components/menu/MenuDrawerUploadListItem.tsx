import { memo } from "react";
import { MENU_BAR_HEIGHT } from "../../services/styles";
import { MenuDrawerUploadListItemProps } from "../../types/props";

function MenuDrawerUploadListItem({
  disabled,
  extension,
  icon,
  id,
  label,
  onChange,
}: MenuDrawerUploadListItemProps) {
  return (
    <li>
      <label
        className="flex flex-col items-start btn btn-ghost rounded-none px-3"
        htmlFor={id}
        style={{ height: `${MENU_BAR_HEIGHT}px` }}
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

export default memo(MenuDrawerUploadListItem);
