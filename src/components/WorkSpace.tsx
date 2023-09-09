import React from "react";
import { Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import { useRecoilValue } from "recoil";
import { chartState, menuBarHeightState } from "../service/atoms";
import useChartSizes from "../hooks/useChartSizes";
import ChartBorderLine from "./ChartBorderLine";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function WorkSpace() {
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);

  // 枠線のサイズを取得
  const { borderSize } = useChartSizes();

  return chart.blocks.length === 0 ? (
    <ReadyFile />
  ) : (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        lineHeight: 0,
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex" }}>
        {[...Array(chart.length)].map((_, column: number) => (
          <React.Fragment key={column}>
            {column === 0 && (
              <ChartBorderLine width={`${borderSize}px`} height="100%" />
            )}
            <ChartVerticalRectangles column={column} />
            <ChartBorderLine width={`${borderSize}px`} height="100%" />
          </React.Fragment>
        ))}
      </div>
      <span
        style={{
          display: "block",
          width: 0,
          height: `calc(100vh - ${menuBarHeight}px)`,
        }}
      />
    </div>
  );
}

export default WorkSpace;
