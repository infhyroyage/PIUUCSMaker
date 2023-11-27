/**
 * Get BPM rounded decimal parts to a maximum of 7 only when the total number of integer and decimal parts is 8 or more
 * @param {number} bpm BPM
 * @returns {number} Rounded BPM
 */
export const roundBpm = (bpm: number): number =>
  bpm.toString().replace(".", "").length < 8
    ? bpm
    : parseFloat(
        bpm.toFixed(Math.max(7 - Math.floor(bpm).toString().length, 0))
      );

/**
 * Get beat converted to string after checking validation under integer in the valid range of 1 to 64
 * @param {string} beatStr String of beat
 * @returns {number | null} Converted beat, null if validation check is invalid
 */
export const validateBeat = (beatStr: string): number | null => {
  const beat = Number(beatStr);
  return !Number.isInteger(beat) || beat < 1 || beat > 64 ? null : beat;
};

/**
 * Get BPM converted to string after checking validation under rounded number to 7 significant digits in the valid range of 0.1 to 999
 * @param {string} bpmStr String of BPM
 * @returns {number | null} Converted BPM, null if validation check is invalid
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
 * Get delay converted to string after checking validation under rounded number to 7 significant digits in the valid range of -999999 to 999999
 * @param {string} delayStr String of delay
 * @returns {number | null} Converted Delay, null if validation check is invalid
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
 * Get a number of rows converted to string after checking validation under integer in the valid range of 1
 * @param {string} rowsStr String of a number of rows
 * @returns {number | null} A converted number of rows, null if validation check is invalid
 */
export const validateRows = (rowsStr: string): number | null => {
  const rows = Number(rowsStr);
  return !Number.isInteger(rows) || rows < 1 ? null : rows;
};

/**
 * Get split converted to string after checking validation under integer in the valid range of 1 to 128
 * @param {string} splitStr String of split
 * @returns {number | null} Converted Split, null if validation check is invalid
 */
export const validateSplit = (splitStr: string): number | null => {
  const split = Number(splitStr);
  return !Number.isInteger(split) || split < 1 || split > 128 ? null : split;
};
