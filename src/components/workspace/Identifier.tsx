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
        // 譜面のブロックの1行あたりの高さ(px)
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // 横の枠線のサイズ(px)
        // noteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)とする
        // ただし、譜面のブロックの高さが横の枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
        const horizontalBorderSize: number = Math.min(
          Math.max(Math.floor(noteSize * 0.025) * 2, 2),
          unitRowHeight * block.rows
        );

        // 譜面のブロック内の節のブロックの個数
        const rectangleLength: number = Math.ceil(
          block.rows / (block.beat * block.split)
        );

        // 譜面のブロック内の各節のブロックの高さ(px)
        let blockHeight: number =
          unitRowHeight * block.rows -
          (blockIdx === blocks.length - 1 ? 0 : horizontalBorderSize);
        const rectangleHeights = [...Array(rectangleLength)].reduce(
          (prev: number[], _, rectangleIdx: number) => {
            if (blockHeight > 0) {
              // 譜面のブロック内の節ごとに分割する枠線を配置するため、その枠線の高さ分をあらかじめ減算しておく
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
                  {/* 譜面のブロック内の節ごとに分割する枠線 */}
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
            {/* 譜面のブロックごとに分割する枠線 */}
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
