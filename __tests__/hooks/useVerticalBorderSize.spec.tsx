import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useStore } from "../../src/hooks/useStore";
import useVerticalBorderSize from "../../src/hooks/useVerticalBorderSize";

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useVerticalBorderSize", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("Return 2 if noteSize is less than 80", () => {
    (useStore as unknown as Mock).mockReturnValue({ noteSize: 79 });
    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(2);
  });

  it("Return 4 if noteSize is equal to 80", () => {
    (useStore as unknown as Mock).mockReturnValue({ noteSize: 80 });
    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(4);
  });

  it("Return more than 2 if noteSize is more than 81", () => {
    (useStore as unknown as Mock).mockReturnValue({ noteSize: 81 });
    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toBeGreaterThan(2);
  });
});
