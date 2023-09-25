import React, { memo, useMemo } from "react";
import { RectangleBlockIdentifierProps } from "../../types/props";
import { useRecoilValue } from "recoil";
import { Zoom } from "../../types/chart";
import { noteSizeState, zoomState } from "../../service/atoms";
import { ZOOM_VALUES } from "../../service/zoom";
import { Paper, Typography } from "@mui/material";
import BorderLine from "../BorderLine";

function RectangleBlockIdentifier({
  beat,
  blockIdx,
  isLastBlock,
  length,
  split,
}: RectangleBlockIdentifierProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 譜面のブロックの1行あたりの高さ(px単位)を計算
  const unitRowHeight = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / split,
    [noteSize, split, zoom.idx]
  );

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  // ただし、譜面のブロックの高さが枠線のサイズより小さい場合、例外的に譜面のブロックの高さと同一とする
  const borderSize: number = useMemo(
    () =>
      Math.min(Math.max(Math.floor(noteSize / 20), 1), unitRowHeight * length),
    [length, noteSize, unitRowHeight]
  );

  // 譜面のブロック内の各節のブロックの高さ(px単位)を枠線の配置を考慮して計算
  const rectangleHeights = useMemo(() => {
    // 譜面のブロック内の節のブロックの個数
    const rectangleLength: number = Math.ceil(length / (beat * split));

    // 譜面のブロックの高さ(px単位)
    // 譜面のブロックごとに分割する枠線を最下部に配置するため、その枠線の高さ分をあらかじめ減算しておく
    let blockHeight: number =
      unitRowHeight * length - (isLastBlock ? 0 : borderSize);

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
          <Paper square sx={{ height: rectangleHeight }}>
            <Typography p={1} variant="caption">
              {`${blockIdx + 1}:${rectangleIdx + 1}`}
            </Typography>
          </Paper>
          {/* 譜面のブロック内の節ごとに分割する枠線 */}
          {rectangleIdx < rectangleHeights.length - 1 && (
            <BorderLine width="100%" height={borderSize} />
          )}
        </React.Fragment>
      ))}
      {/* 譜面のブロックごとに分割する枠線 */}
      {!isLastBlock && <BorderLine width="100%" height={borderSize} />}
    </>
  );
}

export default memo(RectangleBlockIdentifier);