import { renderHook } from "@testing-library/react";
import { useRecoilValue } from "recoil";
import useVerticalBorderSize from "../../src/hooks/useVerticalBorderSize";

jest.mock("recoil", () => ({
  ...jest.requireActual("recoil"),
  useRecoilValue: jest.fn(),
}));

describe("useVerticalBorderSize", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Return 2 if noteSize is less than 80", () => {
    (useRecoilValue as jest.Mock).mockReturnValueOnce(79);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(2);
  });

  it("Return 4 if noteSize is equal to 80", () => {
    (useRecoilValue as jest.Mock).mockReturnValueOnce(80);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toEqual(4);
  });

  it("Return more than 2 if noteSize is more than 81", () => {
    (useRecoilValue as jest.Mock).mockReturnValueOnce(81);

    const { result } = renderHook(useVerticalBorderSize);

    expect(result.current).toBeGreaterThan(2);
  });
});
