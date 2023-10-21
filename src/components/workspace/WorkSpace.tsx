import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  holdSetterState,
  noteSizeState,
  selectorState,
} from "../../service/atoms";
import Chart from "./Chart";
import Identifier from "./Identifier";
import BlockController from "./BlockController";
import { HoldSetter, Selector } from "../../types/chart";
import { MENU_BAR_HEIGHT } from "../../service/styles";

function WorkSpace() {
  const setHoldSetter = useSetRecoilState<HoldSetter>(holdSetterState);
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
      // ESCキー押下時に、ホールド設置中・選択領域の表示パラメーターをすべて初期化
      if (event.key === "Escape") {
        setHoldSetter(null);
        setSelector({ setting: null, completed: null });
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
  }, [setNoteSize, setSelector]);

  return (
    <div
      onMouseUp={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // 左クリック時のみ、選択領域・マウス押下した場合の表示パラメーターをすべて初期化
        if (event.button === 0) {
          setHoldSetter(null);
          setSelector({ setting: null, completed: null });
        }
      }}
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        lineHeight: 0,
        marginLeft: `${MENU_BAR_HEIGHT}px`,
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
          height: `calc(100vh - ${MENU_BAR_HEIGHT}px)`,
        }}
      />
    </div>
  );
}

export default WorkSpace;
