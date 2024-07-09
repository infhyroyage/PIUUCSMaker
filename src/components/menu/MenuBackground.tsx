import { MENU_BACKGROUND_Z_INDEX } from "../../services/styles";
import { MenuBackgroundProps } from "../../types/props";

export default function MenuBackground({ onClose }: MenuBackgroundProps) {
  return (
    <div
      className="fixed inset-0 opacity-50"
      style={{
        zIndex: MENU_BACKGROUND_Z_INDEX,
      }}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        onClose();
      }}
      onContextMenu={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
    />
  );
}
