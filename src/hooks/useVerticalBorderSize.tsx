import { useMemo } from "react";
import { useStore } from "./useStore";

function useVerticalBorderSize() {
  const { noteSize } = useStore();

  // Calculate the vertical border size (px) as 0.05 times noteSize (round down to an even number, minimum 2)
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  return verticalBorderSize;
}
export default useVerticalBorderSize;
