import { Box } from "@mui/material";
import { Chart } from "../types/ucs";
import UploadRequest from "./UploadRequest";
import { useState } from "react";

function WorkSpace() {
  const [chart, setChart] = useState<Chart | undefined>(undefined);

  return chart ? (
    // TODO: 譜面のレンダリング
    <>
      <Box>{chart.length}</Box>
      <Box>{chart.isPerformance}</Box>
      {chart.blocks.map((block, idx) => (
        <Box key={idx}>{JSON.stringify(block)}</Box>
      ))}
      {chart.notes.map((note, idx) => (
        <Box key={idx}>{JSON.stringify(note)}</Box>
      ))}
    </>
  ) : (
    <UploadRequest setChart={setChart} />
  );
}

export default WorkSpace;
