import { useEffect, useState } from "react";

function useChartSizes() {
  /*
   * ウィンドウサイズを監視し、正方形である単ノートの1辺のサイズ(noteSize)、
   * および、枠線のサイズ(borderSize)をpx単位で計算
   * noteSize := min(ウィンドウサイズの横幅, ウィンドウサイズの高さ) / 13
   * borderSize := noteSize / 20
   * ただし、borderSizeの最小値は1とする
   */
  const [chartLengths, setChartLengths] = useState<{
    noteSize: number;
    borderSize: number;
  }>({ noteSize: 0, borderSize: 0 });
  useEffect(() => {
    // 初回レンダリング時の初期設定
    const handleWindowResize = () => {
      const noteSize: number =
        window.innerWidth > window.innerHeight
          ? window.innerHeight / 13
          : window.innerWidth / 13;
      const borderSize: number =
        window.innerWidth > window.innerHeight
          ? window.innerHeight / 260
          : window.innerWidth / 260;
      setChartLengths({
        noteSize: noteSize > 20 ? Math.floor(noteSize) : 20,
        borderSize: borderSize > 1 ? Math.floor(borderSize) : 1,
      });
    };
    handleWindowResize();

    // ウィンドウサイズ変更の監視
    window.addEventListener("resize", handleWindowResize);
    // アンマウント時に上記監視を解除
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return chartLengths;
}

export default useChartSizes;
