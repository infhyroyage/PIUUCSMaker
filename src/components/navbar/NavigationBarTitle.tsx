import { useMemo } from "react";
import { useStore } from "../../hooks/useStore";

function NavigationBarTitle() {
  const { isPerformance, isProtected, mp3Name, notes, ucsName } = useStore();

  const title = useMemo(
    () => (
      <div className="text-lg truncate">
        {`${isProtected ? "*" : ""}${ucsName || "PIU UCS Maker"}`}
      </div>
    ),
    [isProtected, ucsName]
  );

  const caption = useMemo(
    () =>
      notes.length > 0 && (
        <div className="text-xs truncate">
          {`${notes.length === 5 ? "Single" : "Double"} ${
            isPerformance ? "Performance" : ""
          }${mp3Name ? ` (${mp3Name})` : ""}`}
        </div>
      ),
    [isPerformance, mp3Name, notes.length]
  );

  return (
    <div className="flex flex-col">
      {title}
      {caption}
    </div>
  );
}

export default NavigationBarTitle;
