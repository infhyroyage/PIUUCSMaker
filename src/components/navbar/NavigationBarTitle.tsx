import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useStore } from "../../hooks/useStore";
import {
  isPerformanceState,
  isProtectedState,
  notesState,
  ucsNameState,
} from "../../services/atoms";
import { Note } from "../../types/ucs";

function NavigationBarTitle() {
  const { mp3Name } = useStore();
  const isPerformance = useRecoilValue<boolean>(isPerformanceState);
  const isProtected = useRecoilValue<boolean>(isProtectedState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);

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
