import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useStore } from "../../hooks/useStore";
import { isProtectedState, notesState } from "../../services/atoms";
import { Note } from "../../types/ucs";

function NavigationBarTitle() {
  const { isPerformance, mp3Name, ucsName } = useStore();
  const isProtected = useRecoilValue<boolean>(isProtectedState);
  const notes = useRecoilValue<Note[][]>(notesState);

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
