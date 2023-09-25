import { useEffect } from "react";
import ReadyUCS from "./ReadyUCS";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  menuBarHeightState,
  noteSizeState,
  ucsNameState,
} from "../service/atoms";
import Chart from "./chart/Chart";
import RectangleIdentifier from "./identifier/RectangleIdentifier";
import BlockController from "./controller/BlockController";

function WorkSpace() {
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);
  const setNoteSize = useSetRecoilState<number>(noteSizeState);

  // ウィンドウサイズを監視し、正方形である単ノートの1辺のサイズ(noteSize)を以下で計算
  // noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 13
  // ただし、noteSizeの最小値は20とする
  useEffect(() => {
    const handleWindowResize = () =>
      setNoteSize(
        Math.max(
          Math.floor(Math.min(window.innerWidth, window.innerHeight) / 13),
          20
        )
      );

    // 初回レンダリング時の初期設定
    handleWindowResize();
    // ウィンドウサイズ変更の監視
    window.addEventListener("resize", handleWindowResize);
    // アンマウント時に上記監視を解除
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return ucsName === null ? (
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
      <div style={{ display: "flex", position: "relative" }}>
        <RectangleIdentifier />
        <Chart />
        <BlockController />
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
