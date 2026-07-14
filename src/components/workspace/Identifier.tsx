import React from "react";
import { useStore } from "../../hooks/useStore";
import { ZOOM_VALUES } from "../../services/assets";
import { IDENTIFIER_WIDTH } from "../../services/styles";
import { Block } from "../../types/ucs";
import BorderLine from "./BorderLine";

function Identifier() {
  const { blocks, noteSize, zoom } = useStore();

  return (
    <div style={{ userSelect: "none", width: `${IDENTIFIER_WIDTH}px` }}>
      {blocks.map((block: Block, blockIdx: number) => {
        // Height (px) per row of chart block
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // Horizontal border size (px)
        // Use 0.05 times noteSize, rounded down to even, with a minimum value of 2
        // However, use the same value as chart block height if chart block height is smaller than horizontal border size
        const horizontalBorderSize: number = Math.min(
          Math.max(Math.floor(noteSize * 0.025) * 2, 2),
          unitRowHeight * block.rows
        );

        // Number of measure blocks in chart block
        const rectangleLength: number = Math.ceil(
          block.rows / (block.beat * block.split)
        );

        // Height (px) of each measure block in chart block
        let blockHeight: number =
          unitRowHeight * block.rows -
          (blockIdx === blocks.length - 1 ? 0 : horizontalBorderSize);
        const rectangleHeights = [...Array(rectangleLength)].reduce(
          (prev: number[], _, rectangleIdx: number) => {
            if (blockHeight > 0) {
              // Subtract horizontal border height in advance to place borders that separate each measure in chart block
              const rectangleHeight: number =
                unitRowHeight * block.beat * block.split -
                (rectangleIdx === rectangleLength - 1
                  ? 0
                  : horizontalBorderSize);

              prev.push(Math.min(rectangleHeight, blockHeight));
              blockHeight -= unitRowHeight * block.beat * block.split;
            }
            return prev;
          },
          []
        );

        return (
          <React.Fragment key={blockIdx}>
            {rectangleHeights.map(
              (rectangleHeight: number, rectangleIdx: number) => (
                <React.Fragment key={rectangleIdx}>
                  <span
                    className="bg-base-200 text-base-content block w-full text-center"
                    style={{ height: `${rectangleHeight}px` }}
                  >
                    <p className="p-0 text-xs">
                      {`${blockIdx + 1}: ${rectangleIdx + 1}`}
                    </p>
                  </span>
                  {/* Border that separates each measure in chart block */}
                  {rectangleIdx < rectangleHeights.length - 1 && (
                    <BorderLine
                      style={{
                        height: `${horizontalBorderSize}px`,
                        width: "100%",
                      }}
                    />
                  )}
                </React.Fragment>
              )
            )}
            {/* Border that separates each chart block */}
            {blockIdx < blocks.length - 1 && (
              <BorderLine
                style={{ height: `${horizontalBorderSize}px`, width: "100%" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Identifier;
