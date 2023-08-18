import { Block, Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import ChartBlock from "./ChartBlock";
import { useRecoilValue } from "recoil";
import { chartState } from "../service/atoms";
import { useMemo } from "react";

function WorkSpace() {
  const chart: Chart | undefined = useRecoilValue<Chart | undefined>(
    chartState
  );

  const chartBlocks: React.ReactNode[] = useMemo(() => {
    if (chart) {
      let accumulatedBlockLength: number = 0;
      return chart.blocks.reduce(
        (prev: React.ReactNode[], block: Block, idx: number) => {
          prev.push(
            <ChartBlock
              key={idx}
              chartLength={chart.length}
              blockIdx={idx}
              blockLength={block.length}
              accumulatedBlockLength={accumulatedBlockLength}
              split={block.split}
              notes={block.notes}
            />
          );
          accumulatedBlockLength = accumulatedBlockLength + block.length;
          return prev;
        },
        []
      );
    } else {
      return [];
    }
  }, [chart]);

  return chartBlocks.length > 0 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {chartBlocks}
    </div>
  ) : (
    <ReadyFile />
  );
}

export default WorkSpace;
