import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import { NAVIGATION_BAR_HEIGHT } from "../../services/styles";
import BlockController from "./BlockController";
import Chart from "./Chart";
import Identifier from "./Identifier";

function WorkSpace() {
  const { resetHoldSetter, resizeNoteSizeWithWindow, hideSelector } =
    useStore();

  useEffect(() => {
    // ウィンドウサイズから、正方形である単ノートの1辺のサイズ(noteSize)を以下で計算
    // noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 15
    // ただし、noteSizeは小数点以下を切り捨てとし、最小値が20とする
    const handleWindowResize = () => resizeNoteSizeWithWindow();
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESCキー押下時に、ホールド設置中・選択領域の表示パラメーターをすべて初期化
      if (event.key === "Escape") {
        resetHoldSetter();
        hideSelector();
      }
    };

    // 初回レンダリング時にnoteSizeを初期設定
    handleWindowResize();

    // イベントリスナーを登録し、アンマウント時にすべて解除
    window.addEventListener("resize", handleWindowResize); // noteSize変更
    window.addEventListener("keydown", handleKeyDown); // キー入力
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resetHoldSetter, resizeNoteSizeWithWindow, hideSelector]);

  return (
    <div
      onMouseUp={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // 左クリック時のみ、選択領域・マウス押下した場合の表示パラメーターをすべて初期化
        if (event.button === 0) {
          resetHoldSetter();
          hideSelector();
        }
      }}
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        lineHeight: 0,
        marginTop: `${NAVIGATION_BAR_HEIGHT}px`,
        marginLeft: `${NAVIGATION_BAR_HEIGHT}px`,
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
          height: `calc(100vh - ${NAVIGATION_BAR_HEIGHT}px)`,
        }}
      />
    </div>
  );
}

export default WorkSpace;
