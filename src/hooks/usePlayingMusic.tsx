import { useEffect, useRef, useState } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilValue } from "recoil";
import { volumeValueState } from "../service/atoms";

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const volumeValue = useRecoilValue<number>(volumeValueState);

  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const intervalIds = useRef<NodeJS.Timeout[]>([]);

  const start = () => setIsPlaying(true);
  const stop = () => setIsPlaying(false);

  // beat.wavをデコードして読み込み
  useEffect(() => {
    const context = new AudioContext();
    audioContext.current = context;
    gainNode.current = context.createGain();
    fetch(beatWav)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((decodedAudio) => {
        beatAudioBuffer.current = decodedAudio;
      });
  }, []);

  // 音量を0(ミュート)から1(MAX)まで動的に設定
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volumeValue;
    }
  }, [volumeValue]);

  useEffect(() => {
    if (isPlaying) {
      // TODO: ビート音の再生間隔の暫定値
      const intervals = [0, 1000, 2000, 2500, 3000, 4000];

      // 各ビート音の再生間隔をそれぞれ設定
      for (let intervalIdx = 0; intervalIdx < intervals.length; intervalIdx++) {
        const interval = intervals[intervalIdx];
        const intervalId = setTimeout(() => {
          // beat.wavを読み込んだ場合のみビート音を再生
          if (audioContext.current && gainNode.current) {
            sourceNode.current = audioContext.current.createBufferSource();
            sourceNode.current.buffer = beatAudioBuffer.current;
            sourceNode.current.connect(gainNode.current);
            gainNode.current.connect(audioContext.current.destination);
            sourceNode.current.start();
          }

          // ビート音がすべて再生が終了したら停止するリスナーを設定
          if (intervalIdx === intervals.length - 1) {
            if (sourceNode.current) {
              sourceNode.current.addEventListener("ended", stop);
            } else {
              stop();
            }
          }
        }, interval);
        intervalIds.current.push(intervalId);
      }
    } else if (sourceNode.current) {
      // ビート音がすべて再生が終了したら停止するリスナーを解除
      sourceNode.current.removeEventListener("ended", stop);

      // ビート音の再生を中断
      sourceNode.current.stop();
      if (gainNode.current) {
        gainNode.current.disconnect();
      }
      sourceNode.current.disconnect();

      // 設定した各ビート音の再生間隔を初期化
      intervalIds.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      intervalIds.current = [];
    }
  }, [isPlaying]);

  return { isPlaying, start, stop };
}

export default usePlayingMusic;
