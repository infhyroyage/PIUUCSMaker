import React, { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";
import { ChartVerticalRectanglesProps } from "../types/props";
import ChartBorderLine from "./ChartBorderLine";
import ChartRectangle from "./ChartRectangle";

function ChartVerticalRectangles({
  beat,
  isEven,
  isLastBlock,
  length,
  split,
  unitRowHeight,
}: ChartVerticalRectanglesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize = useMemo(
    () =>
      Math.min(
        noteSize > 20 ? Math.floor(noteSize / 20) : 1,
        unitRowHeight * length
      ),
    [length, noteSize, unitRowHeight]
  );

  // 各ChartRectangleの高さ(px単位)を枠線の配置を考慮して計算
  const rectangleHeights = useMemo(() => {
    // ChartRectangleの個数
    const rectangleLength = Math.ceil(length / (beat * split));

    // 譜面のブロックの高さ(px単位)
    // 譜面のブロックごとに分割する枠線を最下部に配置するため、その枠線の高さ分をあらかじめ減算しておく
    let blockHeight = unitRowHeight * length - (isLastBlock ? 0 : borderSize);

    return [...Array(rectangleLength)].reduce(
      (prev: number[], _, rectangleIdx: number) => {
        if (blockHeight > 0) {
          // 譜面のブロック内の節ごとに分割する枠線を配置するため、その枠線の高さ分をあらかじめ減算しておく
          const rectangleHeight: number =
            unitRowHeight * beat * split -
            (rectangleIdx === rectangleLength - 1 ? 0 : borderSize);

          prev.push(Math.min(rectangleHeight, blockHeight));
          blockHeight -= unitRowHeight * beat * split;
        }
        return prev;
      },
      []
    );
  }, [beat, borderSize, isLastBlock, length, split, unitRowHeight]);

  return (
    <>
      {rectangleHeights.map((rectangleHeight: number, rectangleIdx: number) => (
        <React.Fragment key={rectangleIdx}>
          <ChartRectangle height={rectangleHeight} isEven={isEven} />
          {/* 譜面のブロック内の節ごとに分割する枠線 */}
          {rectangleIdx < rectangleHeights.length - 1 && (
            <ChartBorderLine width={noteSize} height={borderSize} />
          )}
        </React.Fragment>
      ))}
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <ChartBorderLine width={noteSize} height={borderSize} />}
    </>
  );
}

export default memo(ChartVerticalRectangles);
