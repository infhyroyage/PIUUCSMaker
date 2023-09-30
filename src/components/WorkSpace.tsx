import { useCallback, useEffect } from "react";
import ReadyUCS from "./ReadyUCS";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  menuBarHeightState,
  mouseDownState,
  noteSizeState,
  selectorState,
  ucsNameState,
} from "../service/atoms";
import Chart from "./chart/Chart";
import RectangleIdentifier from "./identifier/RectangleIdentifier";
import BlockController from "./controller/BlockController";
import { MouseDown, Selector } from "../types/chart";

function WorkSpace() {
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);
  const setMouseDown = useSetRecoilState<MouseDown>(mouseDownState);
  const setNoteSize = useSetRecoilState<number>(noteSizeState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

  // ウィンドウサイズを監視し、正方形である単ノートの1辺のサイズ(noteSize)を以下で計算
  // noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 15
  // ただし、noteSizeは小数点以下を切り捨てとし、最小値が20とする
  useEffect(() => {
    const handleWindowResize = () =>
      setNoteSize(
        Math.max(
          Math.floor(Math.min(window.innerWidth, window.innerHeight) / 15),
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

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // 左クリック時のみ、選択領域・マウス押下時のパラメーターを初期化
      if (event.button === 0) {
        setMouseDown(null);
        setSelector({ changingCords: null, completedCords: null });
      }
    },
    [setMouseDown, setSelector]
  );

  return ucsName === null ? (
    <ReadyUCS />
  ) : (
    <div
      onMouseUp={onMouseUp}
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
