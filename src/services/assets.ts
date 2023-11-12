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
 * 列インデックスごとの単ノート・ホールドの画像ファイルのバイナリデータ
 * 非ローカル環境の場合はバイナリデータが存在するGitHubのURL、ローカル環境の場合はバイナリデータそのもの
 */
export const BEAT_BINARY: string =
  process.env.NODE_ENV === "production"
    ? "https://github.com/infhyroyage/PIUUCSMaker/raw/main/src/sounds/beat.wav"
    : Beat;

/**
 * 列インデックスごとの単ノート・ホールドの画像ファイルのバイナリデータ
 * 非ローカル環境の場合はバイナリデータが存在するGitHubのURL、ローカル環境の場合はバイナリデータそのもの
 */
export const IMAGE_BINARIES: { note: string; hold: string }[] =
  process.env.NODE_ENV === "production"
    ? [
        {
          note: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/note0.png",
          hold: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/hold0.png",
        },
        {
          note: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/note1.png",
          hold: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/hold1.png",
        },
        {
          note: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/note2.png",
          hold: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/hold2.png",
        },
        {
          note: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/note3.png",
          hold: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/hold3.png",
        },
        {
          note: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/note4.png",
          hold: "https://raw.githubusercontent.com/infhyroyage/PIUUCSMaker/main/src/images/hold4.png",
        },
      ]
    : [
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
