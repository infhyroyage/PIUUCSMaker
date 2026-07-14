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
    // Resize noteSize as follows with window size update
    // noteSize := min(window width, window height) / 15
    // However, noteSize is rounded down to the nearest integer, with a minimum value of 20
    const handleWindowResize = () => resizeNoteSizeWithWindow();
    const handleKeyDown = (event: KeyboardEvent) => {
      // Reset display parameter when setting a hold and display parameter of the selection area when pressing ESC
      if (event.key === "Escape") {
        resetHoldSetter();
        hideSelector();
      }
    };

    // Initialize noteSize at first rendering
    handleWindowResize();

    // Register event listeners and unregister on unmount
    window.addEventListener("resize", handleWindowResize); // noteSize update
    window.addEventListener("keydown", handleKeyDown); // Key input
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resetHoldSetter, resizeNoteSizeWithWindow, hideSelector]);

  return (
    <div
      onMouseUp={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // Reset selection area and display parameter when setting a hold only for left click
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
