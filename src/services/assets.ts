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

/**
 * 列インデックスごとの単ノート・ホールドの画像ファイルのバイナリデータ
 */
export const IMAGE_BINARIES: { note: string; hold: string }[] = [
  { note: Note0, hold: Hold0 },
  { note: Note1, hold: Hold1 },
  { note: Note2, hold: Hold2 },
  { note: Note3, hold: Hold3 },
  { note: Note4, hold: Hold4 },
];

/**
 * 倍率の値
 */
export const ZOOM_VALUES: number[] = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];
