import { Box, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  isPerformanceState,
  isProtectedState,
  mp3NameState,
  notesState,
  ucsNameState,
} from "../../services/atoms";
import { Note } from "../../types/ucs";
import { useMemo } from "react";

function MenuBarTitle() {
  const isPerformance = useRecoilValue<boolean>(isPerformanceState);
  const isProtected = useRecoilValue<boolean>(isProtectedState);
  const mp3Name = useRecoilValue<string | null>(mp3NameState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);

  const title = useMemo(
    () => (
      <Typography variant="subtitle1" noWrap component="div">
        {`${isProtected ? "*" : ""}${ucsName || "PIU UCS Maker"}`}
      </Typography>
    ),
    [isProtected, ucsName]
  );

  const caption = useMemo(
    () =>
      notes.length > 0 && (
        <Typography variant="caption" noWrap component="div">
          {`${notes.length === 5 ? "Single" : "Double"} ${
            isPerformance ? "Performance" : ""
          }${mp3Name ? ` (${mp3Name})` : ""}`}
        </Typography>
      ),
    [isPerformance, mp3Name, notes.length]
  );

  return (
    <Box flexGrow={1}>
      {title}
      {caption}
    </Box>
  );
}

export default MenuBarTitle;
