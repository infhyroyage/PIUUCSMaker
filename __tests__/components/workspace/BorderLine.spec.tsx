import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import BorderLine from "../../../src/components/workspace/BorderLine";

describe("BorderLine", () => {
  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render correctly", () => {
    const style = { height: "1px", width: "2px" };
    const { container } = render(<BorderLine style={style} />);

    expect(container.firstChild).toHaveStyle({
      display: "block",
      backgroundColor: "rgb(11, 93, 153)",
      height: "1px",
      width: "2px",
    });
  });
});
