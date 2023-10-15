import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  menuBarHeightState,
  mouseDownState,
  noteSizeState,
  selectorState,
} from "../service/atoms";
import Chart from "./chart/Chart";
import Identifier from "./identifier/Identifier";
import BlockController from "./controller/BlockController";
import { MouseDown, Selector } from "../types/ui";

function WorkSpace() {
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const setMouseDown = useSetRecoilState<MouseDown>(mouseDownState);
  const setNoteSize = useSetRecoilState<number>(noteSizeState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

  useEffect(() => {
    // ウィンドウサイズから、正方形である単ノートの1辺のサイズ(noteSize)を以下で計算
    // noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 15
    // ただし、noteSizeは小数点以下を切り捨てとし、最小値が20とする
    const handleWindowResize = () =>
      setNoteSize(
        Math.max(
          Math.floor(Math.min(window.innerWidth, window.innerHeight) / 15),
          20
        )
      );
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESCキー押下時に、選択領域・マウス押下した場合の表示パラメーターをすべて初期化
      if (event.key === "Escape") {
        setMouseDown(null);
        setSelector({ changingCords: null, completedCords: null });
      }
    };

    // 初回レンダリング時にnoteSizeを初期設定
    handleWindowResize();

    // イベントリスナーを登録
    window.addEventListener("resize", handleWindowResize); // noteSize変更
    window.addEventListener("keydown", handleKeyDown); // キー入力

    // アンマウント時に上記イベントリスナーをすべて解除
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setNoteSize, setSelector]);

  return (
    <div
      onMouseUp={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // 左クリック時のみ、選択領域・マウス押下した場合の表示パラメーターをすべて初期化
        if (event.button === 0) {
          setMouseDown(null);
          setSelector({ changingCords: null, completedCords: null });
        }
      }}
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        lineHeight: 0,
        marginLeft: `${menuBarHeight}px`,
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
        <Identifier />
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
