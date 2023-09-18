import { useEffect, useRef, useTransition } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartState,
  fileNamesState,
  isPlayingState,
  noteSizeState,
  userErrorMessageState,
  volumeValueState,
  zoomState,
} from "../service/atoms";
import { FileNames, Zoom } from "../types/atoms";
import { Block, Chart, Note } from "../types/ucs";
import { ZOOM_VALUES } from "../service/zoom";

function usePlayingMusic() {
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const [fileNames, setFileNames] = useRecoilState<FileNames>(fileNamesState);
  const chart = useRecoilValue<Chart>(chartState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const volumeValue = useRecoilValue<number>(volumeValueState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const musicAudioBuffer = useRef<AudioBuffer | null>(null);
  const beatSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const previousScrollTime = useRef<number>(0);
  const currentScrollTime = useRef<number>(0);

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
    if (!isPlaying) return;

    // 手動での上下スクロールを抑止
    document.body.style.overflowY = "hidden";

    // 自動スクロールスタート地点でのブラウザの画面のy座標を初期化
    // 現在のブラウザの画面が最上部以外の場合はそのy座標とし、最上部の場合は0番目の譜面のブロックのDelayが正の場合において
    // ビート音を再生するまでの時間を遅延する必要があるため、その分だけブラウザの画面のy座標を減算する
    let top: number =
      document.documentElement.scrollTop > 0
        ? document.documentElement.scrollTop
        : chart.blocks[0].delay > 0
        ? (-2.0 *
            chart.blocks[0].delay *
            noteSize *
            ZOOM_VALUES[zoom.idx] *
            chart.blocks[0].bpm) /
          60000
        : 0;

    // ビート音を再生するタイミング・下へスクロールする速度(px/ms)が変化するタイミングでのブラウザの画面のy座標、
    // および、現在のブラウザの画面のy座標に応じた自動スクロール経過時間(秒)を計算
    let verocity: number = -1;
    let border: number = 0;
    type ScrollParam = {
      beatTops: number[];
      verocities: { verocity: number; border: number }[];
      elapsedMusicTime: number;
    };
    const scrollParam: ScrollParam = chart.blocks.reduce(
      (prev: ScrollParam, block: Block, blockIdx: number) => {
        // 各譜面のブロックの1行あたりの高さをpx単位で計算
        // 譜面のブロックの1行あたりの高さ := 2 * noteSize * 倍率 / 譜面のブロックのSplit
        // 例えば、この高さに譜面のブロックの行数を乗ずると、譜面のブロックの高さとなる
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

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
              border + unitRowHeight * (rowIdx - block.accumulatedLength)
          );
        prev.beatTops = prev.beatTops.concat(tops);

        // 開始地点からの下へスクロールする速度(px/ms)を計算し、
        // その速度が変化するブラウザの画面のy座標を追加
        const blockVerocity: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.bpm) / 60000;
        if (blockVerocity !== verocity) {
          if (blockIdx > 0) {
            prev.verocities.push({ verocity, border });
          }
          verocity = blockVerocity;
        }

        //自動スクロール経過時間(秒)を現在のブラウザの画面のy座標に応じて追加
        if (
          border + unitRowHeight * block.length <
          document.documentElement.scrollTop
        ) {
          prev.elapsedMusicTime +=
            (unitRowHeight * block.length) / (blockVerocity * 1000);
        } else if (border < document.documentElement.scrollTop) {
          prev.elapsedMusicTime +=
            (document.documentElement.scrollTop - border) /
            (blockVerocity * 1000);
        }

        // 譜面のブロックの1行あたりの高さ(px単位)をインクリメント
        border += unitRowHeight * block.length;

        // 最後の譜面のブロックの下へスクロールする速度(px/ms)が変化するブラウザの画面のy座標を追加
        if (blockIdx === chart.blocks.length - 1) {
          prev.verocities.push({ verocity, border });
        }

        return prev;
      },
      { elapsedMusicTime: 0, beatTops: [], verocities: [] }
    );

    // ビート音を再生するタイミング・下へスクロールする速度(px/ms)が変化するタイミングでの
    // 自動スクロール開始時のインデックスを計算
    let beatTopIdx: number = scrollParam.beatTops.findIndex(
      (value: number) => value > document.documentElement.scrollTop
    );
    if (beatTopIdx === -1) {
      beatTopIdx = scrollParam.beatTops.length;
    }
    let verocityIdx: number = scrollParam.verocities.findIndex(
      (value: { verocity: number; border: number }) =>
        value.border > document.documentElement.scrollTop
    );
    if (verocityIdx === -1) {
      verocityIdx = scrollParam.verocities.length;
    }

    // MP3ファイルの音楽を再生
    if (audioContext.current && gainNode.current) {
      musicSourceNode.current = audioContext.current.createBufferSource();
      musicSourceNode.current.buffer = musicAudioBuffer.current;
      musicSourceNode.current.connect(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);
      musicSourceNode.current.start(
        // 0番目の譜面のブロックのDelayが負の場合は、現在のブラウザの画面のy座標に応じた自動スクロール経過時間(秒)に応じて、
        // MP3ファイルの音楽を再生するまでの時間を遅延する
        chart.blocks[0].delay < 0 &&
          chart.blocks[0].delay / 1000 + scrollParam.elapsedMusicTime < 0
          ? (-1 * chart.blocks[0].delay) / 1000 - scrollParam.elapsedMusicTime
          : 0,
        // 現在のブラウザの画面のy座標に応じた自動スクロール経過時間(秒)に応じて、MP3ファイルの音楽を再生するオフセットを設定する
        scrollParam.elapsedMusicTime > 0 &&
          chart.blocks[0].delay / 1000 + scrollParam.elapsedMusicTime > 0
          ? chart.blocks[0].delay / 1000 + scrollParam.elapsedMusicTime
          : 0
      );
    }

    // 60fpsで自動スクロールを開始
    const FPS: number = 60;
    previousScrollTime.current = Date.now();
    const scrollIntervalId: NodeJS.Timeout = setInterval(() => {
      if (verocityIdx === scrollParam.verocities.length) {
        // 最後の譜面のブロックをスクロールし終えたら停止
        stop();
      } else {
        // 最後にスクロールしてからの現在時刻からスクロール間の時間(ms)であるelapsedTimeを計算
        // この時間は理論上は1000 / FPSと一致するが、実動作上は必ずしも一致しない
        currentScrollTime.current = Date.now();
        const elapsedScrollTime: number =
          currentScrollTime.current - previousScrollTime.current;
        previousScrollTime.current = currentScrollTime.current;

        // スクロール後のブラウザの画面のy座標(px)を計算し、下へスクロール
        top += scrollParam.verocities[verocityIdx].verocity * elapsedScrollTime;
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
      }
    }, 1000 / FPS);

    return () => {
      // 手動での上下スクロール抑止を解除
      document.body.style.overflowY = "scroll";

      // ビート音の再生を中断
      if (beatSourceNode.current) {
        beatSourceNode.current.stop();
        beatSourceNode.current.disconnect();
      }

      // 自動スクロールを停止
      clearInterval(scrollIntervalId);

      // MP3ファイルの音楽の再生を中断
      if (musicSourceNode.current) {
        musicSourceNode.current.stop();
        musicSourceNode.current.disconnect();
      }

      if (gainNode.current) {
        gainNode.current.disconnect();
      }
    };
  }, [isPlaying]);

  return { isUploadingMP3: isPending, start, stop, uploadMP3 };
}

export default usePlayingMusic;
