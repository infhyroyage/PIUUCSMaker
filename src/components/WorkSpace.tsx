import { Chart } from "../types/ucs";
import UploadRequest from "./UploadRequest";
import { useState } from "react";
// import Note0 from "../images/note0.png";
import ChartBlock from "./ChartBlock";

function WorkSpace() {
  const [chart, setChart] = useState<Chart | undefined>(undefined);

  return chart ? (
    // TODO: 譜面のレンダリング
    // 単ノート: <img src={Note0} alt="note0" width={noteLength} height={noteLength} />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chart.blocks.map((block, idx) => (
        <ChartBlock
          key={idx}
          chartLength={chart.length}
          blockLength={block.length}
        />
      ))}
      {chart.notes.map((note, idx) => (
        <div key={idx}>{JSON.stringify(note)}</div>
      ))}
    </div>
  ) : (
    <UploadRequest setChart={setChart} />
  );
}

export default WorkSpace;
