import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import UserErrorSnackbar from "../../../src/components/snackbar/UserErrorSnackbar";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("UserErrorSnackbar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render invisibly if userErrorMessageState is empty", () => {
    (useStore as unknown as Mock).mockReturnValue({ userErrorMessage: "" });
    const { queryByRole } = render(<UserErrorSnackbar />);

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Rerender visibly if userErrorMessageState is not empty", async () => {
    (useStore as unknown as Mock).mockReturnValue({
      userErrorMessage: "UserErrorMessage",
    });
    const { getByText } = render(<UserErrorSnackbar />);

    await waitFor(() =>
      expect(getByText("UserErrorMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    (useStore as unknown as Mock).mockReturnValue({
      userErrorMessage: "UserErrorMessage",
    });
    const { findByTestId, queryByText } = render(<UserErrorSnackbar />);

    await userEvent.click(await findByTestId("user-error-snackbar-close"));

    await waitFor(() =>
      expect(queryByText("UserErrorMessage")).not.toBeInTheDocument()
    );
  });
});
