import React, { memo, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { noteSizeState, zoomState } from "../../service/atoms";
import { ChartVerticalRectanglesProps } from "../../types/props";
import BorderLine from "../BorderLine";
import { Zoom } from "../../types/chart";
import { ZOOM_VALUES } from "../../service/zoom";

function ChartVerticalRectangles({
  beat,
  isEven,
  isLastBlock,
  length,
  split,
}: ChartVerticalRectanglesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 譜面のブロックの1行あたりの高さ(px単位)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize = useMemo(
    () =>
      Math.min(Math.max(Math.floor(noteSize / 20), 1), unitRowHeight * length),
    [length, noteSize, unitRowHeight]
  );

  // 譜面のブロック内の各節のブロックの高さ(px単位)を枠線の配置を考慮して計算
  const rectangleHeights = useMemo(() => {
    // 譜面のブロック内の節のブロックの個数
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
          <span
            style={{
              width: "100%",
              height: rectangleHeight,
              backgroundColor: isEven
                ? "rgb(255, 255, 170)"
                : "rgb(170, 255, 255)",
            }}
          />
          {/* 譜面のブロック内の節ごとに分割する枠線 */}
          {rectangleIdx < rectangleHeights.length - 1 && (
            <BorderLine width={noteSize} height={borderSize} />
          )}
        </React.Fragment>
      ))}
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <BorderLine width={noteSize} height={borderSize} />}
    </>
  );
}

export default memo(ChartVerticalRectangles);
