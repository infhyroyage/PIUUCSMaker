import { Chart } from "../types/ucs";
import UploadRequest from "./UploadRequest";
import { useState } from "react";
import ChartBlock from "./ChartBlock";
// import Note0 from "../images/note0.png";

function WorkSpace() {
  const [chart, setChart] = useState<Chart | undefined>(undefined);

  return chart ? (
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
          isEvenIdx={idx % 2 === 0}
          blockLength={block.length}
          split={block.split}
        />
      ))}
      {chart.notes.map((note, idx) => (
        // TODO: 単ノート/ホールドのレンダリング
        // 単ノート: <img src={Note0} alt="note0" width={noteLength} height={noteLength} />
        <div key={idx}>{JSON.stringify(note)}</div>
      ))}
    </div>
  ) : (
    <UploadRequest setChart={setChart} />
  );
}

export default WorkSpace;
