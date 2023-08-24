import { Block, Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import ChartBlock from "./ChartBlock";
import { useRecoilValue } from "recoil";
import { chartState } from "../service/atoms";
import { useMemo } from "react";

function WorkSpace() {
  const chart: Chart | null = useRecoilValue<Chart | null>(chartState);

  const chartBlocks: React.ReactNode[] = useMemo(() => {
    if (chart === null) return [];

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
          />
        );
        accumulatedBlockLength = accumulatedBlockLength + block.length;
        return prev;
      },
      []
    );
  }, [chart]);

  return chartBlocks.length > 0 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        userSelect: "none",
      }}
    >
      {chartBlocks}
    </div>
  ) : (
    <ReadyFile />
  );
}

export default WorkSpace;
