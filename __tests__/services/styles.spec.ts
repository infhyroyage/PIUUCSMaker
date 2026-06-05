import { describe, expect, it } from "vitest";
import {
  DIALOG_Z_INDEX,
  DRAWER_OPENED_WIDTH,
  DRAWER_Z_INDEX,
  IDENTIFIER_WIDTH,
  MENU_BACKGROUND_Z_INDEX,
  MENU_Z_INDEX,
  NAVIGATION_BAR_HEIGHT,
  NAVIGATION_BAR_Z_INDEX,
  SNACKBAR_Z_INDEX,
} from "../../src/services/styles";

describe("styles", () => {
  // Given: layout z-index constants
  // When: comparing layering order
  // Then: drawer < navbar < menu background < menu < dialog < snackbar
  it("defines z-index layering in ascending order", () => {
    expect(DRAWER_Z_INDEX).toBeLessThan(NAVIGATION_BAR_Z_INDEX);
    expect(NAVIGATION_BAR_Z_INDEX).toBeLessThan(MENU_BACKGROUND_Z_INDEX);
    expect(MENU_BACKGROUND_Z_INDEX).toBeLessThan(MENU_Z_INDEX);
    expect(MENU_Z_INDEX).toBeLessThan(DIALOG_Z_INDEX);
    expect(DIALOG_Z_INDEX).toBeLessThan(SNACKBAR_Z_INDEX);
  });

  it("exports expected layout constants", () => {
    expect(DRAWER_OPENED_WIDTH).toBe(180);
    expect(IDENTIFIER_WIDTH).toBe(36);
    expect(NAVIGATION_BAR_HEIGHT).toBe(48);
    expect(MENU_BACKGROUND_Z_INDEX).toBe(MENU_Z_INDEX - 1);
  });
});
