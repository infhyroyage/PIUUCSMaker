import Note0 from "../images/note0.png";
import Note1 from "../images/note1.png";
import Note2 from "../images/note2.png";
import Note3 from "../images/note3.png";
import Note4 from "../images/note4.png";
import Hold0 from "../images/hold0.png";
import Hold1 from "../images/hold1.png";
import Hold2 from "../images/hold2.png";
import Hold3 from "../images/hold3.png";
import Hold4 from "../images/hold4.png";
import Beat from "../sounds/beat.wav";

/**
 * Audio binary Data of beat sound
 */
export const BEAT_BINARY: string = Beat;

/**
 * Image binary Datas of holds per column index
 */
export const HOLD_BINARIES: string[] = [Hold0, Hold1, Hold2, Hold3, Hold4];

/**
 * Image binary Datas of single notes per column index
 */
export const NOTE_BINARIES: string[] = [Note0, Note1, Note2, Note3, Note4];

/**
 * Zoom Ratios
 */
export const ZOOM_VALUES: number[] = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];
