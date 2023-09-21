import { useEffect } from "react";
import { Block } from "../types/chart";
import ReadyUCS from "./ReadyUCS";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  menuBarHeightState,
  noteSizeState,
} from "../service/atoms";
import Chart from "./Chart";

function WorkSpace() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const setNoteSize = useSetRecoilState<number>(noteSizeState);

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

  return blocks.length === 0 ? (
    <ReadyUCS />
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
        <Chart />
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
