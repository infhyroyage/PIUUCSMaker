import { useEffect, useRef, useState } from "react";
import beatWav from "../sounds/beat.wav";
import { isVolumeOnState } from "../service/atoms";
import { useRecoilValue } from "recoil";

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isVolumeOn = useRecoilValue<boolean>(isVolumeOnState);

  const beatAudioContext = useRef<AudioContext | null>(null);
  const beatGainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const sourceNode = useRef<AudioBufferSourceNode | null>(null);
  const intervalIds = useRef<NodeJS.Timeout[]>([]);

  const start = () => setIsPlaying(true);
  const stop = () => setIsPlaying(false);

  // Sound ON場合のみbeat.wavをデコードして読み込み
  useEffect(() => {
    if (isVolumeOn) {
      const context = new AudioContext();
      beatAudioContext.current = context;
      beatGainNode.current = context.createGain();
      fetch(beatWav)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
        .then((decodedAudio) => {
          beatAudioBuffer.current = decodedAudio;
        });
    }
  }, [isVolumeOn]);

  // Sound ONの場合は音量を100%、Sound OFFの場合は0%として動的に設定
  useEffect(() => {
    if (beatGainNode.current) {
      beatGainNode.current.gain.value = isVolumeOn ? 1 : 0;
    }
  }, [isVolumeOn]);

  useEffect(() => {
    if (isPlaying) {
      // TODO: ビート音の再生間隔の暫定値
      const intervals = [0, 1000, 2000, 2500, 3000, 4000];

      // 各ビート音の再生間隔をそれぞれ設定
      for (let intervalIdx = 0; intervalIdx < intervals.length; intervalIdx++) {
        const interval = intervals[intervalIdx];
        const intervalId = setTimeout(() => {
          // beat.wavを読み込んだ場合のみビート音を再生
          if (beatAudioContext.current && beatGainNode.current) {
            sourceNode.current = beatAudioContext.current.createBufferSource();
            sourceNode.current.buffer = beatAudioBuffer.current;
            sourceNode.current.connect(beatGainNode.current);
            beatGainNode.current.connect(beatAudioContext.current.destination);
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
      if (beatGainNode.current) {
        beatGainNode.current.disconnect();
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
