import { useMemo } from "react";
import { useStore } from "./useStore";

function useVerticalBorderSize() {
  const { noteSize } = useStore();

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  return verticalBorderSize;
}
export default useVerticalBorderSize;
