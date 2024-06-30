import { DARK_BACKGROUND_Z_INDEX } from "../../services/styles";
import { DarkBackgroundProps } from "../../types/props";

export default function DarkBackground({ onClose }: DarkBackgroundProps) {
  return (
    <div
      className="fixed inset-0 opacity-50 bg-black"
      style={{
        zIndex: DARK_BACKGROUND_Z_INDEX,
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
