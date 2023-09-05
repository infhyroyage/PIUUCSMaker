import { useEffect, useRef, useState, useTransition } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  fileNamesState,
  userErrorMessageState,
  volumeValueState,
} from "../service/atoms";
import { FileNames } from "../types/atoms";

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fileNames, setFileNames] = useRecoilState<FileNames>(fileNamesState);
  const volumeValue = useRecoilValue<number>(volumeValueState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const musicAudioBuffer = useRef<AudioBuffer | null>(null);
  const beatSourceNode = useRef<AudioBufferSourceNode | null>(null);
  // const musicSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const intervalIds = useRef<NodeJS.Timeout[]>([]);

  const [isPending, startTransition] = useTransition();

  const start = () => {
    // beat.wavをデコードして読み込んでいない場合は読み込んでおく
    if (beatAudioBuffer.current === null) {
      fetch(beatWav)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          // AudioContext/GainNodeを初期化していない場合は初期化しておく
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
            gainNode.current = audioContext.current.createGain();
            gainNode.current.gain.value = volumeValue;
          }

          return audioContext.current.decodeAudioData(arrayBuffer);
        })
        .then(
          (decodedAudio: AudioBuffer) =>
            (beatAudioBuffer.current = decodedAudio)
        );
    }

    setIsPlaying(true);
  };

  const stop = () => setIsPlaying(false);

  // 音量を0(ミュート)から1(MAX)まで動的に設定
  useEffect(() => {
    if (gainNode.current !== null) {
      gainNode.current.gain.value = volumeValue;
    }
  }, [volumeValue]);

  const uploadMP3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    // MP3ファイルを何もアップロードしなかった場合はNOP
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) return;

    // 拡張子チェック
    if (fileList[0].name.split(".").pop() !== "mp3") {
      setUserErrorMessage("拡張子がmp3ではありません");
      return;
    }

    startTransition(() => {
      // アップロードしたMP3ファイルをデコードして読み込み
      fileList[0]
        .arrayBuffer()
        .then((arrayBuffer: ArrayBuffer) => {
          // AudioContext/GainNodeを初期化していない場合は初期化しておく
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
            gainNode.current = audioContext.current.createGain();
            gainNode.current.gain.value = volumeValue;
          }

          return audioContext.current.decodeAudioData(arrayBuffer);
        })
        .then((decodedAudio: AudioBuffer) => {
          musicAudioBuffer.current = decodedAudio;
          setFileNames({ ...fileNames, mp3: fileList[0].name });
        });
    });
  };

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
            beatSourceNode.current = audioContext.current.createBufferSource();
            beatSourceNode.current.buffer = beatAudioBuffer.current;
            beatSourceNode.current.connect(gainNode.current);
            gainNode.current.connect(audioContext.current.destination);
            beatSourceNode.current.start();
          }

          // ビート音がすべて再生が終了したら停止するリスナーを設定
          if (intervalIdx === intervals.length - 1) {
            if (beatSourceNode.current) {
              beatSourceNode.current.addEventListener("ended", stop);
            } else {
              stop();
            }
          }
        }, interval);
        intervalIds.current.push(intervalId);
      }
    } else if (beatSourceNode.current) {
      // ビート音がすべて再生が終了したら停止するリスナーを解除
      beatSourceNode.current.removeEventListener("ended", stop);

      // ビート音の再生を中断
      beatSourceNode.current.stop();
      if (gainNode.current) {
        gainNode.current.disconnect();
      }
      beatSourceNode.current.disconnect();

      // 設定した各ビート音の再生間隔を初期化
      intervalIds.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      intervalIds.current = [];
    }
  }, [isPlaying]);

  return { isPlaying, isUploadingMP3: isPending, start, stop, uploadMP3 };
}

export default usePlayingMusic;
