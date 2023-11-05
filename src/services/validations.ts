/**
 * 指定したBeat値の文字列に対し、有効範囲1〜64の整数値のもとでバリデーションチェック後に変換する
 * @param beatStr Beat値の文字列
 * @returns 変換したBeat値、バリデーションエラーの場合はnull
 */
export const validateBeat = (beatStr: string): number | null => {
  const beat = Number(beatStr);
  return !Number.isInteger(beat) || beat < 1 || beat > 64 ? null : beat;
};

/**
 * 指定したBPM値の文字列に対し、有効数字7桁までの有効範囲0.1〜999のもとでバリデーションチェック後に変換する
 * @param bpmStr BPM値の文字列
 * @returns 変換したBPM値、バリデーションエラーの場合はnull
 */
export const validateBpm = (bpmStr: string): number | null => {
  const bpm: number = Number(bpmStr);
  return bpmStr.replace(".", "").length > 7 ||
    Number.isNaN(bpm) ||
    bpm < 0.1 ||
    bpm > 999
    ? null
    : bpm;
};

/**
 * 指定したDelay値の文字列に対し、有効数字7桁までの有効範囲-999999〜999999のもとでバリデーションチェック後に変換する
 * @param delayStr Delay値の文字列
 * @returns 変換したDelay値、バリデーションエラーの場合はnull
 */
export const validateDelay = (delayStr: string): number | null => {
  const delay: number = Number(delayStr);
  return delayStr === "" ||
    delayStr.replace("-", "").replace(".", "").length > 7 ||
    Number.isNaN(delay) ||
    delay < -999999 ||
    delay > 999999
    ? null
    : delay;
};

/**
 * 指定した行数の文字列に対し、有効範囲1以上の整数値のもとでバリデーションチェック後に変換する
 * @param rowsStr 行数の文字列
 * @returns 変換した行数、バリデーションエラーの場合はnull
 */
export const validateRows = (rowsStr: string): number | null => {
  const rows = Number(rowsStr);
  return !Number.isInteger(rows) || rows < 1 ? null : rows;
};

/**
 * 指定したSplit値の文字列に対し、有効範囲1〜128の整数値のもとでバリデーションチェック後に変換する
 * @param splitStr Split値の文字列
 * @returns 変換したSplit値、バリデーションエラーの場合はnull
 */
export const validateSplit = (splitStr: string): number | null => {
  const split = Number(splitStr);
  return !Number.isInteger(split) || split < 1 || split > 128 ? null : split;
};
