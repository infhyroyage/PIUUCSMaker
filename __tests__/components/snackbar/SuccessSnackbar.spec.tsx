import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import SuccessSnackbar from "../../../src/components/snackbar/SuccessSnackbar";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("SuccessSnackbar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render invisibly if successMessageState is empty", () => {
    (useStore as unknown as Mock).mockReturnValue({ successMessage: "" });
    const { queryByRole } = render(<SuccessSnackbar />);

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Rerender visibly if successMessageState is not empty", async () => {
    (useStore as unknown as Mock).mockReturnValue({
      successMessage: "SuccessMessage",
    });
    const { getByText } = render(<SuccessSnackbar />);

    await waitFor(() =>
      expect(getByText("SuccessMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    // Given: Snackbar is visible with a success message
    let successMessage = "SuccessMessage";
    const setSuccessMessage = vi.fn((value: string) => {
      successMessage = value;
    });
    (useStore as unknown as Mock).mockImplementation(() => ({
      successMessage,
      setSuccessMessage,
    }));
    const { findByTestId, queryByText, rerender } = render(<SuccessSnackbar />);

    // When: User clicks the close control
    await userEvent.click(await findByTestId("success-snackbar-close"));

    // Then: Store clear is requested and the message is hidden after re-render (as zustand would)
    expect(setSuccessMessage).toHaveBeenCalledWith("");
    rerender(<SuccessSnackbar />);

    await waitFor(() =>
      expect(queryByText("SuccessMessage")).not.toBeInTheDocument()
    );
  });
});
