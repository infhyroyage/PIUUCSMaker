import React from "react";
import { Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import { useRecoilValue } from "recoil";
import { chartState } from "../service/atoms";
import useChartSizes from "../hooks/useChartSizes";
import ChartBorderLine from "./ChartBorderLine";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function WorkSpace() {
  const chart: Chart | null = useRecoilValue<Chart | null>(chartState);

  // 単ノートの1辺、枠線のサイズを取得
  const { noteSize, borderSize } = useChartSizes();

  return chart === null ? (
    <ReadyFile />
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        userSelect: "none",
        lineHeight: 0,
      }}
    >
      {[...Array(chart.length)].map((_, column: number) => (
        <React.Fragment key={column}>
          {column === 0 && (
            <ChartBorderLine width={`${borderSize}px`} height="100%" />
          )}
          <ChartVerticalRectangles
            borderSize={borderSize}
            column={column}
            noteSize={noteSize}
          />
          <ChartBorderLine width={`${borderSize}px`} height="100%" />
        </React.Fragment>
      ))}
    </div>
  );
}

export default WorkSpace;
