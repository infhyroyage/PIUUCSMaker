import { Chart } from "../types/ucs";
import UploadRequest from "./UploadRequest";
import { useEffect, useState } from "react";
import Note0 from "../images/note0.png";
import Note1 from "../images/note1.png";
import Note2 from "../images/note2.png";
import Note3 from "../images/note3.png";
import Note4 from "../images/note4.png";

// 枠線の長さ(px単位)
const BORDER_LENGTH: number = 2;

function WorkSpace() {
  const [chart, setChart] = useState<Chart | undefined>(undefined);

  /*
   * ウィンドウサイズを監視し、正方形である単ノートの1辺の長さをpx単位で計算
   * noteLength := ( min( (ウィンドウサイズの横幅), (ウィンドウサイズの高さ) ) - 9 * (枠線の長さ) ) / 10
   * TODO: CSSで設定してレスポンシブにしたい
   */
  const [noteLength, setNoteLength] = useState<number>(0.0);
  useEffect(() => {
    // 初回レンダリング時の初期設定
    const handleWindowResize = () => {
      const minLength: number =
        window.innerWidth > window.innerHeight
          ? window.innerHeight
          : window.innerWidth;
      setNoteLength((minLength - 9.0 * BORDER_LENGTH) / 10.0);
    };
    handleWindowResize();

    // ウィンドウサイズ変更の監視
    window.addEventListener("resize", handleWindowResize);
    // アンマウント時に上記監視を解除
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return chart ? (
    // TODO: 譜面のレンダリング
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>{noteLength}</div>
      <div>
        <img src={Note0} alt="note0" width={noteLength} height={noteLength} />
        <img src={Note1} alt="note1" width={noteLength} height={noteLength} />
        <img src={Note2} alt="note2" width={noteLength} height={noteLength} />
        <img src={Note3} alt="note3" width={noteLength} height={noteLength} />
        <img src={Note4} alt="note4" width={noteLength} height={noteLength} />
        <img src={Note0} alt="note0" width={noteLength} height={noteLength} />
        <img src={Note1} alt="note1" width={noteLength} height={noteLength} />
        <img src={Note2} alt="note2" width={noteLength} height={noteLength} />
        <img src={Note3} alt="note3" width={noteLength} height={noteLength} />
        <img src={Note4} alt="note4" width={noteLength} height={noteLength} />
      </div>
      <div>{chart.length}</div>
      <div>{chart.isPerformance}</div>
      {chart.blocks.map((block, idx) => (
        <div key={idx}>{JSON.stringify(block)}</div>
      ))}
      {chart.notes.map((note, idx) => (
        <div key={idx}>{JSON.stringify(note)}</div>
      ))}
    </div>
  ) : (
    <UploadRequest setChart={setChart} />
  );
}

export default WorkSpace;
