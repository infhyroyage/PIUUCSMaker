import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import NavigationBar from "../../../src/components/navbar/NavigationBar";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/navbar/NavigationBarTitle", () => ({
  default: () => <div data-testid="navigation-bar-title" />,
}));

const mockUpdateZoomFromIdx = vi.fn();
const mockSetVolumeValue = vi.fn();

describe("NavigationBar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      isPlaying: false,
      isProtected: false,
      volumeValue: 0.5,
      setVolumeValue: mockSetVolumeValue,
      zoom: { idx: 0, top: null },
      updateZoomFromIdx: mockUpdateZoomFromIdx,
    });
  });
  afterEach(() => cleanup());

  it("updates zoom from select change", async () => {
    // Given: navigation bar with zoom select
    const { getByRole } = render(<NavigationBar />);

    // When: user selects another zoom index
    await userEvent.selectOptions(getByRole("combobox"), "1");

    // Then: store zoom updater runs
    expect(mockUpdateZoomFromIdx).toHaveBeenCalledWith(1);
  });

  it("mutes and restores volume via volume button", async () => {
    // Given: audible volume
    const { getByRole } = render(<NavigationBar />);
    const button = getByRole("button");

    // When: mute then unmute
    await userEvent.click(button);
    await userEvent.click(button);

    // Then: volume goes to zero then back
    expect(mockSetVolumeValue).toHaveBeenCalledWith(0);
    expect(mockSetVolumeValue).toHaveBeenCalledWith(0.5);
  });

  it("does not register beforeunload listener when not protected", () => {
    // Given: unprotected chart
    const addSpy = vi.spyOn(window, "addEventListener");
    (useStore as unknown as Mock).mockReturnValue({
      isPlaying: false,
      isProtected: false,
      volumeValue: 0.5,
      setVolumeValue: mockSetVolumeValue,
      zoom: { idx: 0, top: null },
      updateZoomFromIdx: mockUpdateZoomFromIdx,
    });

    // When: navbar mounts
    render(<NavigationBar />);

    // Then: beforeunload listener is not attached
    expect(
      addSpy.mock.calls.some(([event]) => event === "beforeunload")
    ).toBe(false);
    addSpy.mockRestore();
  });

  it("registers beforeunload listener when protected", () => {
    // Given: protected chart
    const addSpy = vi.spyOn(window, "addEventListener");
    (useStore as unknown as Mock).mockReturnValue({
      isPlaying: false,
      isProtected: true,
      volumeValue: 0.5,
      setVolumeValue: mockSetVolumeValue,
      zoom: { idx: 0, top: null },
      updateZoomFromIdx: mockUpdateZoomFromIdx,
    });

    // When: navbar mounts
    render(<NavigationBar />);

    // Then: beforeunload listener is attached
    expect(addSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    addSpy.mockRestore();
  });
});
