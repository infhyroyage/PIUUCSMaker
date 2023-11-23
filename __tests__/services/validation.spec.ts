import {
  roundBpm,
  validateBeat,
  validateBpm,
  validateDelay,
  validateRows,
  validateSplit,
} from "../../src/services/validations";

describe("roundBpm", () => {
  it("Return the original number if total digits are less than 8", () =>
    expect(roundBpm(123.4567)).toBe(123.4567));

  it("Round off the decimal if total digits are 8 or more and integer part is less than 7", () =>
    expect(roundBpm(1.23456789)).toBe(1.234568));

  it("Round up the decimal if total digits are 8 or more and integer part is 7 or more", () =>
    expect(roundBpm(1234567.89)).toBe(1234568));
});

describe("validateBeat", () => {
  it("Pass with 1", () => expect(validateBeat("1")).toBe(1));

  it("Pass with 64", () => expect(validateBeat("64")).toBe(64));

  it("Fail with 0", () => expect(validateBeat("0")).toBeNull());

  it("Fail with over 65", () => expect(validateBeat("65")).toBeNull());

  it("Fail with empty", () => expect(validateBeat("")).toBeNull());

  it("Fail with decimal", () => expect(validateBeat("2.1")).toBeNull());

  it("Fail with non-number", () => expect(validateBeat("abc")).toBeNull());
});

describe("validateBpm", () => {
  it("Pass with 0.1", () => expect(validateBpm("0.1")).toBe(0.1));

  it("Pass with 123.4567", () =>
    expect(validateBpm("123.4567")).toBe(123.4567));

  it("Pass with 999", () => expect(validateBpm("999")).toBe(999));

  it("Fail with 0.9999999", () => expect(validateBpm("0.9999999")).toBeNull());

  it("Fail with 123.45678", () => expect(validateBpm("123.45678")).toBeNull());

  it("Fail with 999.0001", () => expect(validateBpm("999.0001")).toBeNull());

  it("Fail with empty", () => expect(validateBpm("")).toBeNull());

  it("Fail with non-number", () => expect(validateBpm("abc")).toBeNull());
});

describe("validateDelay", () => {
  it("Pass with -999999", () => expect(validateDelay("-999999")).toBe(-999999));

  it("Pass with 123.4567", () =>
    expect(validateDelay("123.4567")).toBe(123.4567));

  it("Pass with 999999", () => expect(validateDelay("999999")).toBe(999999));

  it("Fail with -999999.1", () =>
    expect(validateDelay("-999999.1")).toBeNull());

  it("Fail with 123.45678", () =>
    expect(validateDelay("123.45678")).toBeNull());

  it("Fail with 999999.1", () => expect(validateDelay("999999.1")).toBeNull());

  it("Fail with empty", () => expect(validateDelay("")).toBeNull());

  it("Fail with non-number", () => expect(validateDelay("abc")).toBeNull());
});

describe("validateRows", () => {
  it("Pass with 1", () => expect(validateRows("1")).toBe(1));

  it("Fail with 0", () => expect(validateRows("0")).toBeNull());

  it("Fail with empty", () => expect(validateRows("")).toBeNull());

  it("Fail with decimal", () => expect(validateRows("2.1")).toBeNull());

  it("Fail with non-number", () => expect(validateRows("abc")).toBeNull());
});

describe("validateSplit", () => {
  it("Pass with 1", () => expect(validateSplit("1")).toBe(1));

  it("Pass with 128", () => expect(validateSplit("128")).toBe(128));

  it("Fail with 0", () => expect(validateSplit("0")).toBeNull());

  it("Fail with over 129", () => expect(validateSplit("129")).toBeNull());

  it("Fail with empty", () => expect(validateSplit("")).toBeNull());

  it("Fail with decimal", () => expect(validateSplit("2.1")).toBeNull());

  it("Fail with non-number", () => expect(validateSplit("abc")).toBeNull());
});
