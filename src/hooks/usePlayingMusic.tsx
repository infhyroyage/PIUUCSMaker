import { useCallback, useEffect, useRef, useState } from "react";
import beatWav from "../sounds/beat.wav";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  isMuteBeatsState,
  isPlayingState,
  mp3NameState,
  noteSizeState,
  notesState,
  successMessageState,
  userErrorMessageState,
  volumeValueState,
  zoomState,
} from "../service/atoms";
import { Zoom } from "../types/menu";
import { Block, Note } from "../types/ucs";
import { ZOOM_VALUES } from "../service/zoom";

function usePlayingMusic() {
  const [isUploadingMP3, setIsUploadingMP3] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const isMuteBeats = useRecoilValue<boolean>(isMuteBeatsState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const volumeValue = useRecoilValue<number>(volumeValueState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setMp3Name = useSetRecoilState<string | null>(mp3NameState);
  const setSuccessMessage = useSetRecoilState<string>(successMessageState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const audioContext = useRef<AudioContext | null>(null);
  const beatGainNode = useRef<GainNode | null>(null);
  const musicGainNode = useRef<GainNode | null>(null);
  const beatAudioBuffer = useRef<AudioBuffer | null>(null);
  const musicAudioBuffer = useRef<AudioBuffer | null>(null);
  const beatSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceNode = useRef<AudioBufferSourceNode | null>(null);
  const previousScrollTime = useRef<number>(0);
  const currentScrollTime = useRef<number>(0);

  const start = () => {
    // beat.wavをデコードして読み込んでいない場合は読み込んでおく
    if (beatAudioBuffer.current === null) {
      fetch(beatWav)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          // AudioContextを初期化していない場合は初期化しておく
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
          }

          // ビート音用のGainNodeを初期化していない場合は初期化しておく
          if (beatGainNode.current === null) {
            beatGainNode.current = audioContext.current.createGain();
            beatGainNode.current.gain.value = isMuteBeats ? 0 : volumeValue;
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

  // ビート音用の音量を0(ミュート)から1(MAX)まで動的に設定
  useEffect(() => {
    if (beatGainNode.current !== null) {
      beatGainNode.current.gain.value = isMuteBeats ? 0 : volumeValue;
    }
  }, [isMuteBeats, volumeValue]);

  const onUploadMP3 = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // MP3ファイルを何もアップロードしなかった場合はNOP
      const fileList: FileList | null = event.target.files;
      if (!fileList || fileList.length === 0) return;

      // 拡張子チェック
      if (fileList[0].name.split(".").pop() !== "mp3") {
        setUserErrorMessage("拡張子がmp3ではありません");
        return;
      }

      // アップロードしたMP3ファイルをデコードして読み込み
      setIsUploadingMP3(true);
      fileList[0]
        .arrayBuffer()
        .then((arrayBuffer: ArrayBuffer) => {
          // AudioContextを初期化していない場合は初期化しておく
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
          }

          // MP3ファイルの音楽用のGainNodeを初期化していない場合は初期化しておく
          if (musicGainNode.current === null) {
            musicGainNode.current = audioContext.current.createGain();
            musicGainNode.current.gain.value = volumeValue;
          }

          return audioContext.current.decodeAudioData(arrayBuffer);
        })
        .then((decodedAudio: AudioBuffer) => {
          musicAudioBuffer.current = decodedAudio;
          setMp3Name(fileList[0].name);
          setSuccessMessage(`${fileList[0].name}のアップロードに成功しました`);

          // 同じMP3ファイルを再アップロードできるように初期化
          event.target.value = "";
        })
        .finally(() => setIsUploadingMP3(false));
    },
    [
      setIsUploadingMP3,
      setMp3Name,
      setSuccessMessage,
      setUserErrorMessage,
      volumeValue,
    ]
  );

  // MP3ファイルの音楽用の音量を0(ミュート)から1(MAX)まで動的に設定
  useEffect(() => {
    if (musicGainNode.current !== null) {
      musicGainNode.current.gain.value = volumeValue;
    }
  }, [volumeValue]);

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
        : blocks[0].delay > 0
        ? (-2.0 *
            blocks[0].delay *
            noteSize *
            ZOOM_VALUES[zoom.idx] *
            blocks[0].bpm) /
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
    const scrollParam: ScrollParam = blocks.reduce(
      (prev: ScrollParam, block: Block, blockIdx: number) => {
        // 各譜面のブロックの1行あたりの高さ(px)を計算
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // 列ごとに単ノート/ホールドの始点において、譜面全体での行のインデックスをそれぞれ抽出
        const filteredStarts: number[][] = notes.map((notes: Note[]) =>
          notes
            .filter(
              (note: Note) =>
                ["X", "M"].includes(note.type) &&
                note.rowIdx >= block.accumulatedRows &&
                note.rowIdx < block.accumulatedRows + block.rows
            )
            .map((note: Note) => note.rowIdx)
        );
        // ビート音を再生するタイミングでのブラウザの画面のy座標をまとめて追加
        const tops: number[] = [
          ...new Set<number>(filteredStarts.flat()), // 平滑化して重複排除
        ]
          .sort((a: number, b: number) => a - b) // 譜面全体での行のインデックスを昇順にソート
          .map(
            (rowIdx: number) =>
              border + unitRowHeight * (rowIdx - block.accumulatedRows)
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
          border + unitRowHeight * block.rows <
          document.documentElement.scrollTop
        ) {
          prev.elapsedMusicTime +=
            (unitRowHeight * block.rows) / (blockVerocity * 1000);
        } else if (border < document.documentElement.scrollTop) {
          prev.elapsedMusicTime +=
            (document.documentElement.scrollTop - border) /
            (blockVerocity * 1000);
        }

        // 譜面のブロックの1行あたりの高さ(px)をインクリメント
        border += unitRowHeight * block.rows;

        // 最後の譜面のブロックの下へスクロールする速度(px/ms)が変化するブラウザの画面のy座標を追加
        if (blockIdx === blocks.length - 1) {
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
    if (audioContext.current && musicGainNode.current) {
      musicSourceNode.current = audioContext.current.createBufferSource();
      musicSourceNode.current.buffer = musicAudioBuffer.current;
      musicSourceNode.current.connect(musicGainNode.current);
      musicGainNode.current.connect(audioContext.current.destination);
      musicSourceNode.current.start(
        // 0番目の譜面のブロックのDelayが負の場合は、現在のブラウザの画面のy座標に応じた自動スクロール経過時間(秒)に応じて、
        // MP3ファイルの音楽を再生するまでの時間を遅延する
        blocks[0].delay < 0 &&
          blocks[0].delay / 1000 + scrollParam.elapsedMusicTime < 0
          ? (-1 * blocks[0].delay) / 1000 - scrollParam.elapsedMusicTime
          : 0,
        // 現在のブラウザの画面のy座標に応じた自動スクロール経過時間(秒)に応じて、MP3ファイルの音楽を再生するオフセットを設定する
        scrollParam.elapsedMusicTime > 0 &&
          blocks[0].delay / 1000 + scrollParam.elapsedMusicTime > 0
          ? blocks[0].delay / 1000 + scrollParam.elapsedMusicTime
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
        // 最後にスクロールした時刻から現在時刻までのスクロール間の時間(ms)elapsedTimeを計算
        // この時間は理論上は1000 / FPSと一致するが、実動作上は必ずしも一致しない
        currentScrollTime.current = Date.now();
        let elapsedScrollTime: number =
          currentScrollTime.current - previousScrollTime.current;
        previousScrollTime.current = currentScrollTime.current;

        // スクロール後のブラウザの画面のy座標(px)を計算し、スクロール速度を変更しながら下へスクロール
        while (verocityIdx < scrollParam.verocities.length) {
          if (
            top +
              scrollParam.verocities[verocityIdx].verocity *
                elapsedScrollTime <=
            scrollParam.verocities[verocityIdx].border
          ) {
            // スクロール前後で譜面のブロックを跨がらない場合は、スクロール後のブラウザの画面のy座標(px)の計算をして終了
            top +=
              scrollParam.verocities[verocityIdx].verocity * elapsedScrollTime;
            break;
          } else {
            // スクロール前後で譜面のブロックを跨ぐ場合は、スクロール速度を変更しながらスクロール後のブラウザの画面のy座標(px)を再計算
            elapsedScrollTime -=
              (scrollParam.verocities[verocityIdx].border - top) /
              scrollParam.verocities[verocityIdx].verocity;
            top = scrollParam.verocities[verocityIdx].border;
            verocityIdx += 1;
          }
        }
        window.scrollTo({ top });

        // ブラウザの画面のy座標に応じてビート音を再生
        if (
          beatTopIdx < scrollParam.beatTops.length &&
          scrollParam.beatTops[beatTopIdx] <= top &&
          audioContext.current &&
          beatGainNode.current
        ) {
          beatSourceNode.current = audioContext.current.createBufferSource();
          beatSourceNode.current.buffer = beatAudioBuffer.current;
          beatSourceNode.current.connect(beatGainNode.current);
          beatGainNode.current.connect(audioContext.current.destination);
          beatSourceNode.current.start();
          beatTopIdx += 1;
        }
      }
    }, 1000 / FPS);

    return () => {
      // 手動での上下スクロール抑止を解除
      document.body.style.overflowY = "scroll";

      // 自動スクロールを停止
      clearInterval(scrollIntervalId);

      // ビート音の再生を中断
      if (beatSourceNode.current) {
        beatSourceNode.current.stop();
        beatSourceNode.current.disconnect();
      }
      if (beatGainNode.current) {
        beatGainNode.current.disconnect();
      }

      // MP3ファイルの音楽の再生を中断
      if (musicSourceNode.current) {
        musicSourceNode.current.stop();
        musicSourceNode.current.disconnect();
      }
      if (musicGainNode.current) {
        musicGainNode.current.disconnect();
      }
    };
  }, [isPlaying]);

  return { isUploadingMP3, onUploadMP3, start, stop };
}

export default usePlayingMusic;
