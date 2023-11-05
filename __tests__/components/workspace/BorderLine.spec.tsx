import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import BorderLine from "../../../src/components/workspace/BorderLine";

describe("BorderLine", () => {
  it("Render Correctly", () => {
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
