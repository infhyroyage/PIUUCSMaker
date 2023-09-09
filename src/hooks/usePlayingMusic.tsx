import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  fileNamesState,
  userErrorMessageState,
  volumeValueState,
} from "../service/atoms";
import { FileNames } from "../types/atoms";
import { Block, Chart, Note } from "../types/ucs";

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fileNames, setFileNames] = useRecoilState<FileNames>(fileNamesState);
  const chart = useRecoilValue<Chart>(chartState);
  const volumeValue = useRecoilValue<number>(volumeValueState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const musicAudioBuffer = useRef<AudioBuffer | null>(null);
  const beatSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceNode = useRef<AudioBufferSourceNode | null>(null);
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

  // ビート音を再生するまでの時間(interval)をすべて計算
  const intervals: number[] = useMemo(() => {
    // 譜面のブロック単位でのビート音を再生するまでの時間のオフセット
    let offset: number = 0;

    return chart.blocks.reduce((prev: number[], block: Block) => {
      // 1行あたりのビート音を鳴らす間隔(ms単位)を計算
      const unitDuration: number = 60000 / (block.split * block.bpm);

      // 譜面のブロックに該当するノートの始点での譜面全体での行のインデックスを列ごとに抽出
      const filteredStarts: number[][] = chart.notes.map((notes: Note[]) =>
        notes
          .filter(
            (note: Note) =>
              note.start >= block.accumulatedLength &&
              note.start < block.accumulatedLength + block.length
          )
          .map((note: Note) => note.start)
      );

      // 譜面のブロック単位でビート音を再生する譜面全体での行のインデックスを取得
      const filteredRowIdxes: number[] = [
        ...new Set<number>(filteredStarts.flat()), // 平滑化して重複排除
      ];

      // 譜面のブロック単位でビート音を再生するまでの時間をまとめて追加
      const intervals: number[] = [
        ...prev,
        ...filteredRowIdxes.map(
          (rowIdx: number) =>
            offset + unitDuration * (rowIdx - block.accumulatedLength)
        ),
      ];

      // オフセット更新
      offset += block.length * unitDuration;

      return intervals;
    }, []);
  }, [chart.blocks, chart.notes]);

  useEffect(() => {
    if (isPlaying) {
      // 手動での上下スクロールを抑止
      document.body.style.overflowY = "hidden";

      // 再生開始位置に合うように上下スクロールして調整
      // TODO: 暫定的に開始位置にスクロール
      window.scrollTo(0, 0);

      // 各ビート音・MP3ファイルの音楽を再生するまでの時間をそれぞれ設定
      // 0番目の譜面のブロックのDelayが正の場合は各ビート音、負の場合はMP3ファイルの音楽を再生するまでの時間を遅延する
      const musicInterval: number =
        chart.blocks[0].delay < 0 ? -1 * chart.blocks[0].delay : 0;
      const beatIntervals: number[] = intervals.map(
        (interval: number) =>
          interval + (chart.blocks[0].delay > 0 ? chart.blocks[0].delay : 0)
      );

      // 各ビート音の再生
      for (let i = 0; i < beatIntervals.length; i++) {
        const beatIntervalId: NodeJS.Timeout = setTimeout(() => {
          if (audioContext.current && gainNode.current) {
            beatSourceNode.current = audioContext.current.createBufferSource();
            beatSourceNode.current.buffer = beatAudioBuffer.current;
            beatSourceNode.current.connect(gainNode.current);
            gainNode.current.connect(audioContext.current.destination);
            beatSourceNode.current.start();
          }

          // すべてのビート音の再生が終了したら、MP3ファイルの音楽・ビート音をともに再生停止するリスナーを設定
          // TODO: 現状、全部のビート音の再生終了した瞬間、MP3ファイルの音楽が再生中でもぶつ切りになるが、
          // 将来的には、最下部に自動スクロールした瞬間に、ビート音・MP3ファイルの音楽が再生中でも共にぶつ切りにする
          // (=リスナーをセットせず、単にstop()のみ実行する)
          if (i === intervals.length - 1) {
            if (beatSourceNode.current) {
              beatSourceNode.current.addEventListener("ended", stop);
            } else {
              stop();
            }
          }
        }, beatIntervals[i]);
        intervalIds.current.push(beatIntervalId);
      }

      // MP3ファイルの音楽を再生
      const musicIntervalId: NodeJS.Timeout = setTimeout(() => {
        if (audioContext.current && gainNode.current) {
          musicSourceNode.current = audioContext.current.createBufferSource();
          musicSourceNode.current.buffer = musicAudioBuffer.current;
          musicSourceNode.current.connect(gainNode.current);
          gainNode.current.connect(audioContext.current.destination);
          musicSourceNode.current.start();
        }
      }, musicInterval);
      intervalIds.current.push(musicIntervalId);
    } else {
      // 手動での上下スクロール抑止を解除
      document.body.style.overflowY = "scroll";

      if (musicSourceNode.current || beatSourceNode.current) {
        if (musicSourceNode.current) {
          // MP3ファイルの音楽の再生を中断
          musicSourceNode.current.stop();
          musicSourceNode.current.disconnect();
        }

        if (beatSourceNode.current) {
          // ビート音がすべて再生が終了したら停止するリスナーを解除
          beatSourceNode.current.removeEventListener("ended", stop);

          // ビート音の再生を中断
          beatSourceNode.current.stop();
          beatSourceNode.current.disconnect();
        }

        if (gainNode.current) {
          gainNode.current.disconnect();
        }

        // 設定した各ビート音の再生間隔を初期化
        intervalIds.current.forEach((intervalId) => {
          clearInterval(intervalId);
        });
        intervalIds.current = [];
      }
    }
  }, [isPlaying]);

  return { isPlaying, isUploadingMP3: isPending, start, stop, uploadMP3 };
}

export default usePlayingMusic;
