import { useEffect, useRef, useState, useTransition } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  fileNamesState,
  userErrorMessageState,
  volumeValueState,
  zoomIdxState,
} from "../service/atoms";
import { FileNames } from "../types/atoms";
import { Block, Chart, Note } from "../types/ucs";
import useChartSizes from "./useChartSizes";
import { ZOOM_VALUES } from "../service/zoom";

// TODO: Playを押下してからMP3の音楽を再生するまでの遅延時間(ms)を、ユーザーに設定・ローカルストレージに保存させる
const MUSIC_PLAYING_DELAY: number = -400;

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fileNames, setFileNames] = useRecoilState<FileNames>(fileNamesState);
  const chart = useRecoilValue<Chart>(chartState);
  const volumeValue = useRecoilValue<number>(volumeValueState);
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const musicAudioBuffer = useRef<AudioBuffer | null>(null);
  const beatSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const intervalIds = useRef<NodeJS.Timeout[]>([]);

  const [isPending, startTransition] = useTransition();

  // 単ノートの1辺のサイズを取得
  const { noteSize } = useChartSizes();

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
      // 手動での上下スクロールを抑止
      document.body.style.overflowY = "hidden";

      // 現在のブラウザの画面のy座標を初期化
      // MP3の音楽を再生するまでの遅延時間のユーザー設定値と0番目の譜面のブロックのDelayに応じて、
      // ビート音を再生するまでの時間を遅延する分だけブラウザの画面のy座標を減算する
      let top: number =
        chart.blocks[0].delay - MUSIC_PLAYING_DELAY > 0
          ? (-2.0 *
              (chart.blocks[0].delay - MUSIC_PLAYING_DELAY) *
              noteSize *
              ZOOM_VALUES[zoomIdx] *
              chart.blocks[0].bpm) /
            60000
          : 0;

      // ブラウザの画面のy座標に応じた、各ビート音を再生するタイミング、および、
      // 開始地点からの下へスクロールする速度(px/秒)の推移を計算
      let blockOffset: number = 0;
      let verocity: number = -1;
      let border: number = 0;
      type ScrollParam = {
        beatTops: number[];
        verocities: { verocity: number; border: number }[];
      };
      const scrollParam: ScrollParam = chart.blocks.reduce(
        (prev: ScrollParam, block: Block, blockIdx: number) => {
          // 各譜面のブロックの1行あたりの高さをpx単位で計算
          // 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
          // 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
          const unitRowHeight: number =
            (2.0 * noteSize * ZOOM_VALUES[zoomIdx]) / block.split;

          // 列ごとに各ノートの始点での譜面全体での行のインデックスを抽出
          const filteredStarts: number[][] = chart.notes.map((notes: Note[]) =>
            notes
              .filter(
                (note: Note) =>
                  note.start >= block.accumulatedLength &&
                  note.start < block.accumulatedLength + block.length
              )
              .map((note: Note) => note.start)
          );
          // ビート音を再生するタイミングでのブラウザの画面のy座標をまとめて追加
          const tops: number[] = [
            ...new Set<number>(filteredStarts.flat()), // 平滑化して重複排除
          ]
            .sort((a: number, b: number) => a - b) // 譜面全体での行のインデックスを昇順にソート
            .map(
              (rowIdx: number) =>
                blockOffset + unitRowHeight * (rowIdx - block.accumulatedLength)
            );
          prev.beatTops = prev.beatTops.concat(tops);

          // 譜面のブロックの高さのオフセット更新
          blockOffset += unitRowHeight * block.length;

          // 開始地点からの下へスクロールする速度(px/秒)を計算し、
          // その速度が変化するブラウザの画面のy座標を格納しながら
          // 譜面のブロックの1行あたりの高さ(px単位)をインクリメント
          const blockVerocity: number =
            (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * block.bpm) / 60;
          if (blockVerocity !== verocity) {
            if (blockIdx > 0) {
              prev.verocities.push({ verocity, border });
            }
            verocity = blockVerocity;
          }
          border += unitRowHeight * block.length;
          if (blockIdx === chart.blocks.length - 1) {
            prev.verocities.push({ verocity, border });
          }

          return prev;
        },
        { beatTops: [], verocities: [] }
      );

      // 自動スクロール開始位置を調整
      // TODO: 暫定的に開始位置を0番目の譜面全体での行のインデックスとする
      window.scrollTo({ top });

      // MP3ファイルの音楽を再生
      // ユーザー設定値と0番目の譜面のブロックのDelayに応じて、MP3ファイルの音楽を再生するまでの時間を遅延する
      if (audioContext.current && gainNode.current) {
        musicSourceNode.current = audioContext.current.createBufferSource();
        musicSourceNode.current.buffer = musicAudioBuffer.current;
        musicSourceNode.current.connect(gainNode.current);
        gainNode.current.connect(audioContext.current.destination);
        musicSourceNode.current.start(
          MUSIC_PLAYING_DELAY - chart.blocks[0].delay > 0
            ? (MUSIC_PLAYING_DELAY - chart.blocks[0].delay) / 1000
            : 0
        );
      }

      // 自動スクロールを開始
      const FPS: number = 60;
      let beatTopIdx: number = 0;
      let verocityIdx: number = 0;
      const scrollIntervalId: NodeJS.Timeout = setInterval(() => {
        // スクロール後のブラウザの画面のy座標を計算
        top += scrollParam.verocities[verocityIdx].verocity / FPS;

        // 下へスクロール
        window.scrollTo({ top });

        // ブラウザの画面のy座標に応じてビート音を再生
        if (
          beatTopIdx < scrollParam.beatTops.length &&
          scrollParam.beatTops[beatTopIdx] <= top &&
          audioContext.current &&
          gainNode.current
        ) {
          beatSourceNode.current = audioContext.current.createBufferSource();
          beatSourceNode.current.buffer = beatAudioBuffer.current;
          beatSourceNode.current.connect(gainNode.current);
          gainNode.current.connect(audioContext.current.destination);
          beatSourceNode.current.start();
          beatTopIdx += 1;
        }

        // ブラウザの画面のy座標に応じてスクロール速度を変更
        if (scrollParam.verocities[verocityIdx].border <= top) {
          verocityIdx += 1;
        }

        // 最後の譜面のブロックをスクロールし終えたら停止
        if (verocityIdx === scrollParam.verocities.length) {
          stop();
        }
      }, 1000 / FPS);
      intervalIds.current.push(scrollIntervalId);

      return () => {
        console.log("unmounted");
      };
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
      }

      // 初期化
      intervalIds.current.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      intervalIds.current = [];
    }
  }, [isPlaying]);

  return { isPlaying, isUploadingMP3: isPending, start, stop, uploadMP3 };
}

export default usePlayingMusic;
