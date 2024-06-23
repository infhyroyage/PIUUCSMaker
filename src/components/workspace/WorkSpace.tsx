import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
  holdSetterState,
  noteSizeState,
  selectorState,
} from "../../services/atoms";
import { MENU_BAR_HEIGHT } from "../../services/styles";
import { HoldSetter, Selector } from "../../types/chart";
import BlockController from "./BlockController";
import Chart from "./Chart";
import Identifier from "./Identifier";

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
        setSelector({ completed: null, isSettingByMenu: false, setting: null });
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
  }, [setHoldSetter, setNoteSize, setSelector]);

  return (
    <div
      className="bg-base-100 text-base-content"
      onMouseUp={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // 左クリック時のみ、選択領域・マウス押下した場合の表示パラメーターをすべて初期化
        if (event.button === 0) {
          setHoldSetter(null);
          setSelector({
            completed: null,
            isSettingByMenu: false,
            setting: null,
          });
        }
      }}
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        lineHeight: 0,
        marginTop: `${MENU_BAR_HEIGHT}px`,
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
