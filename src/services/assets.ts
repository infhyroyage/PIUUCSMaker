import Beat from "../assets/beat.wav";
import Note0 from "../assets/note0.png";
import Note1 from "../assets/note1.png";
import Note2 from "../assets/note2.png";
import Note3 from "../assets/note3.png";
import Note4 from "../assets/note4.png";
import Hold0 from "../assets/hold0.png";
import Hold1 from "../assets/hold1.png";
import Hold2 from "../assets/hold2.png";
import Hold3 from "../assets/hold3.png";
import Hold4 from "../assets/hold4.png";

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
