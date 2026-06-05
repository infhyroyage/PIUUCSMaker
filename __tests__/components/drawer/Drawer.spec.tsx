import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import Drawer from "../../../src/components/drawer/Drawer";
import { useStore } from "../../../src/hooks/useStore";

const mockToggleIsDarkMode = vi.fn();
const mockToggleIsMuteBeats = vi.fn();
const mockUpdateZoomFromIdx = vi.fn();
const mockHandleUndo = vi.fn();
const mockHandleRedo = vi.fn();
const mockDownloadUCS = vi.fn();
const mockOpenNewUcsDialog = vi.fn();
const mockStart = vi.fn();
const mockStop = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useChartSnapshot", () => ({
  default: () => ({ handleUndo: mockHandleUndo, handleRedo: mockHandleRedo }),
}));

vi.mock("../../../src/hooks/useDownloadingUCS", () => ({
  default: () => ({ isDownloadingUCS: false, downloadUCS: mockDownloadUCS }),
}));

vi.mock("../../../src/hooks/useNewUcsDialog", () => ({
  default: () => ({ openNewUcsDialog: mockOpenNewUcsDialog }),
}));

vi.mock("../../../src/hooks/usePlaying", () => ({
  default: () => ({
    isUploadingMP3: false,
    onUploadMP3: vi.fn(),
    start: mockStart,
    stop: mockStop,
  }),
}));

vi.mock("../../../src/hooks/useUploadingUCS", () => ({
  default: () => ({ isUploadingUCS: false, onUploadUCS: vi.fn() }),
}));

vi.mock("../../../src/components/drawer/DrawerListItem", () => ({
  default: ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock("../../../src/components/drawer/DrawerUploadListItem", () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

describe("Drawer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      isDarkMode: false,
      toggleIsDarkMode: mockToggleIsDarkMode,
      isMuteBeats: true,
      toggleIsMuteBeats: mockToggleIsMuteBeats,
      isPlaying: false,
      redoSnapshots: [{}],
      ucsName: "test.ucs",
      undoSnapshots: [{}],
      zoom: { idx: 0, top: null },
      updateZoomFromIdx: mockUpdateZoomFromIdx,
    });
  });
  afterEach(() => cleanup());

  it("toggles drawer width when fold button is clicked", async () => {
    // Given: collapsed drawer
    const { getByText, container } = render(<Drawer />);
    const drawer = container.firstChild as HTMLElement;

    // When: expand button is clicked
    await userEvent.click(getByText("Expand"));

    // Then: width increases
    expect(drawer.style.width).toContain("180");

    // When: fold button is clicked
    await userEvent.click(getByText("Fold"));

    // Then: width returns to navbar height
    expect(drawer.style.width).toContain("48");
  });

  it("triggers undo on ctrl+z for non-Mac", () => {
    // Given: drawer on Windows
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Windows",
      configurable: true,
    });
    render(<Drawer />);

    // When: ctrl+z is pressed
    fireEvent.keyDown(window, { key: "z", ctrlKey: true });

    // Then: undo handler runs
    expect(mockHandleUndo).toHaveBeenCalled();
  });

  it("downloads UCS from drawer action", async () => {
    // Given: chart loaded
    const { getByText } = render(<Drawer />);

    // When: Download UCS is clicked
    await userEvent.click(getByText("Download UCS"));

    // Then: download handler runs
    expect(mockDownloadUCS).toHaveBeenCalled();
  });

  it("starts playback from play action", async () => {
    // Given: chart loaded
    const { getByText } = render(<Drawer />);

    // When: Play is clicked
    await userEvent.click(getByText("Play"));

    // Then: start handler runs
    expect(mockStart).toHaveBeenCalled();
  });
});
