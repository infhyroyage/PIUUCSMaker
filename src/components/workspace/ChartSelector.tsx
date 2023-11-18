import { useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  blocksState,
  noteSizeState,
  selectorState,
  zoomState,
} from "../../services/atoms";
import { Block } from "../../types/ucs";
import { Zoom } from "../../types/menu";
import { ZOOM_VALUES } from "../../services/assets";
import { IDENTIFIER_WIDTH } from "../../services/styles";
import { Selector } from "../../types/chart";

function ChartSelector() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const selector = useRecoilValue<Selector>(selectorState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  const theme: Theme = useTheme();

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  // 選択領域の左上の列インデックスを計算(選択領域を表示しない場合はnull)
  const startColumn = useMemo(
    () =>
      selector.completed !== null
        ? selector.completed.startColumn
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.min(
            selector.setting.mouseDownColumn,
            selector.setting.mouseUpColumn
          )
        : null,
    [selector.completed, selector.setting]
  );

  // 選択領域のleft値(px)を計算(選択領域を表示しない場合はnull)
  const left = useMemo(() => {
    if (startColumn === null) return null;

    return IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * startColumn;
  }, [noteSize, startColumn, verticalBorderSize]);

  // 選択領域のtop値(px)を計算(選択領域を表示しない場合はnull)
  const top = useMemo(() => {
    // 選択領域の左上の譜面全体での行インデックスを計算
    const startRowIdx: number | null =
      selector.completed !== null
        ? selector.completed.startRowIdx
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.min(
            selector.setting.mouseDownRowIdx,
            selector.setting.mouseUpRowIdx
          )
        : null;
    if (startRowIdx === null) return null;

    let top: number = 0;
    blocks.some((block: Block) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (startRowIdx < block.accumulatedRows + block.rows) {
        top += unitRowHeight * (startRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, noteSize, selector.completed, selector.setting, zoom.idx]);

  // 選択領域の幅(px)を計算(選択領域を表示しない場合はnull)
  const width = useMemo(() => {
    if (startColumn === null) return null;

    // 選択領域の右下の列インデックスを計算(選択領域を表示しない場合はnull)
    const goalColumn: number | null =
      selector.completed !== null
        ? selector.completed.goalColumn
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.max(
            selector.setting.mouseDownColumn,
            selector.setting.mouseUpColumn
          )
        : null;
    if (goalColumn === null) return null;

    return noteSize * (goalColumn + 1 - startColumn);
  }, [noteSize, selector.completed, selector.setting, startColumn]);

  // 選択領域の高さ(px)を計算(選択領域を表示しない場合はnull)
  const height = useMemo(() => {
    if (top === null) return null;

    // 選択領域の右下の譜面全体での行インデックスを計算
    const goalRowIdx: number | null =
      selector.completed !== null
        ? selector.completed.goalRowIdx
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.max(
            selector.setting.mouseDownRowIdx,
            selector.setting.mouseUpRowIdx
          )
        : null;
    if (goalRowIdx === null) return null;

    // 選択領域の下端のtop値(px)を計算
    let goalTop: number = 0;
    blocks.some((block: Block) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (goalRowIdx < block.accumulatedRows + block.rows) {
        goalTop += unitRowHeight * (goalRowIdx - block.accumulatedRows);
        return true;
      } else {
        goalTop += unitRowHeight * block.rows;
        return false;
      }
    });

    return goalTop + noteSize - top;
  }, [blocks, noteSize, selector.completed, selector.setting, top, zoom.idx]);

  return (
    left !== null &&
    top !== null &&
    width !== null &&
    height !== null && (
      <span
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: theme.zIndex.appBar - 5,
        }}
      />
    )
  );
}

export default ChartSelector;
