import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import NavigationBarTitle from "../../../src/components/navbar/NavigationBarTitle";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("NavigationBarTitle", () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => cleanup());

  it("shows default title when ucsName is null", () => {
    // Given: no UCS loaded
    (useStore as unknown as Mock).mockReturnValue({
      isPerformance: false,
      isProtected: false,
      mp3Name: null,
      notes: [],
      ucsName: null,
    });

    // When: rendering title
    const { getByText } = render(<NavigationBarTitle />);

    // Then: default app name is shown
    expect(getByText("PIU UCS Maker")).toBeInTheDocument();
  });

  it("prefixes title with asterisk when protected", () => {
    // Given: protected chart with name
    (useStore as unknown as Mock).mockReturnValue({
      isPerformance: false,
      isProtected: true,
      mp3Name: null,
      notes: [
        [{ rowIdx: 0, type: "X" }],
        [],
        [],
        [],
        [],
      ],
      ucsName: "test.ucs",
    });

    // When: rendering title
    const { getByText } = render(<NavigationBarTitle />);

    // Then: protected prefix and caption appear
    expect(getByText("*test.ucs")).toBeInTheDocument();
    expect(getByText(/Single/)).toBeInTheDocument();
  });

  it("shows double performance caption with mp3 name", () => {
    // Given: double performance chart with mp3
    (useStore as unknown as Mock).mockReturnValue({
      isPerformance: true,
      isProtected: false,
      mp3Name: "song.mp3",
      notes: [[], [], [], [], [], [], [], [], [], []],
      ucsName: "chart.ucs",
    });

    // When: rendering title
    const { getByText } = render(<NavigationBarTitle />);

    // Then: caption includes mode and mp3
    expect(getByText(/Double Performance \(song\.mp3\)/)).toBeInTheDocument();
  });
});
