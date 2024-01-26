import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRecoilValue } from "recoil";
import useVerticalBorderSize from "../../src/hooks/useVerticalBorderSize";

vi.mock("recoil", async () => ({
  ...(await vi.importActual("recoil")),
  useRecoilValue: vi.fn(),
}));

describe("useVerticalBorderSize", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("Return 2 if noteSize is less than 80", () => {
    (useRecoilValue as Mock).mockReturnValueOnce(79);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(2);
  });

  it("Return 4 if noteSize is equal to 80", () => {
    (useRecoilValue as Mock).mockReturnValueOnce(80);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(4);
  });

  it("Return more than 2 if noteSize is more than 81", () => {
    (useRecoilValue as Mock).mockReturnValueOnce(81);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toBeGreaterThan(2);
  });
});
