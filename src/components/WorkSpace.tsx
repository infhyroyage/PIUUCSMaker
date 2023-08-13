import { Block, Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import ChartBlock from "./ChartBlock";
import { useRecoilValue } from "recoil";
import { chartState } from "../service/atoms";

function WorkSpace() {
  const chart: Chart | undefined = useRecoilValue<Chart | undefined>(
    chartState
  );

  if (chart) {
    let accumulatedBlockLength: number = 0;
    const chartBlocks: React.ReactNode[] = chart.blocks.reduce(
      (prev: React.ReactNode[], block: Block, idx: number) => {
        prev.push(
          <ChartBlock
            key={idx}
            chartLength={chart.length}
            isEvenIdx={idx % 2 === 0}
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

    return (
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
    );
  } else {
    return <ReadyFile />;
  }
}

export default WorkSpace;
