import { describe, expect, it } from "vitest";
import {
  BEAT_BINARY,
  HOLD_BINARIES,
  NOTE_BINARIES,
  ZOOM_VALUES,
} from "../../src/services/assets";

describe("assets", () => {
  it("exports beat and image asset URLs", () => {
    expect(BEAT_BINARY).toBeTruthy();
    expect(NOTE_BINARIES).toHaveLength(5);
    expect(HOLD_BINARIES).toHaveLength(5);
    NOTE_BINARIES.forEach((url) => expect(url).toBeTruthy());
    HOLD_BINARIES.forEach((url) => expect(url).toBeTruthy());
  });

  it("exports zoom ratio presets", () => {
    expect(ZOOM_VALUES).toEqual([1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64]);
    expect(ZOOM_VALUES[0]).toBe(1);
    expect(ZOOM_VALUES[ZOOM_VALUES.length - 1]).toBe(64);
  });
});
