import React, { useEffect, useMemo } from "react";
import { Chart } from "../types/ucs";
import ReadyFile from "./ReadyFile";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chartState,
  menuBarHeightState,
  noteSizeState,
} from "../service/atoms";
import ChartBorderLine from "./ChartBorderLine";
import ChartVerticalRectangles from "./ChartVerticalRectangles";

function WorkSpace() {
  const [noteSize, setNoteSize] = useRecoilState<number>(noteSizeState);
  const chart: Chart = useRecoilValue<Chart>(chartState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);

  // ウィンドウサイズを監視し、正方形である単ノートの1辺のサイズ(noteSize)を以下で計算
  // noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 13
  // ただし、noteSizeの最小値は20とする
  useEffect(() => {
    const handleWindowResize = () => {
      const size: number =
        window.innerWidth > window.innerHeight
          ? window.innerHeight / 13
          : window.innerWidth / 13;
      setNoteSize(size > 20 ? Math.floor(size) : 20);
    };

    // 初回レンダリング時の初期設定
    handleWindowResize();
    // ウィンドウサイズ変更の監視
    window.addEventListener("resize", handleWindowResize);
    // アンマウント時に上記監視を解除
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // 枠線のサイズをnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize = useMemo(
    () => (noteSize > 20 ? Math.floor(noteSize / 20) : 1),
    [noteSize]
  );

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
