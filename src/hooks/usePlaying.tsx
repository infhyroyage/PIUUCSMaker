import { useCallback, useEffect, useRef, useState } from "react";
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
} from "../services/atoms";
import { Zoom } from "../types/menu";
import { Block, Note } from "../types/ucs";
import { BEAT_BINARY, ZOOM_VALUES } from "../services/assets";

function usePlaying() {
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

  const start = () => {
    // beat.wavをデコードして読み込んでいない場合は読み込んでおく
    if (beatAudioBuffer.current === null) {
      fetch(BEAT_BINARY)
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

  const stop = useCallback(() => setIsPlaying(false), [setIsPlaying]);

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
        setUserErrorMessage("Extension is not mp3");
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
          setSuccessMessage(`${fileList[0].name} was successfully uploaded`);

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

  // 再生中は上下手動スクロールを抑止
  useEffect(() => {
    document.body.style.overflowY = isPlaying ? "hidden" : "scroll";
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // スクロール開始地点でのブラウザの画面のy座標を初期化
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

    // アニメーション実行時に参照する以下のパラメーターをまとめて計算する
    // * beatTimes      : ブラウザの画面の最上部でアニメーションを開始してから各ビート音を再生を開始するまでの時間(ms)
    // * borders        : 下へスクロールする速度(px/ms)が変化するタイミングでのブラウザの画面のy座標
    // * verocities     : 上記タイミングにおけるスクロール速度(px/ms)
    // * timestampOffset: 現在のブラウザの画面のy座標におけるアニメーション経過時間(ms)
    // なお、0番目の譜面のブロックのDelayが正の場合はビート音を再生するタイミングを遅延させ、
    // 負の場合はMP3の音楽を再生するタイミングを遅延させるようbeatTimesとtimestampOffsetを計算する
    let accumulatedBeatTime: number = Math.max(blocks[0].delay, 0);
    let border: number = 0;
    let verocity: number = -1;
    type AnimationParam = {
      beatTimes: number[];
      borders: number[];
      verocities: number[];
      timestampOffset: number;
    };
    const animationParam: AnimationParam = blocks.reduce(
      (prev: AnimationParam, block: Block, blockIdx: number) => {
        // 譜面のブロックの1行あたりの高さ(px)を計算
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
        // ブラウザの画面の最上部でアニメーションを開始してからビート音を再生を開始するまでの時間(ms)をそれぞれ計算
        const beatTimes: number[] = [
          ...new Set<number>(filteredStarts.flat()), // 平滑化して重複排除
        ]
          .sort((a: number, b: number) => a - b) // 譜面全体での行のインデックスを昇順にソート
          .map(
            (rowIdx: number) =>
              accumulatedBeatTime +
              (60000 * (rowIdx - block.accumulatedRows)) /
                (block.bpm * block.split)
          ); // 自動スクロール時間の計算
        prev.beatTimes = prev.beatTimes.concat(beatTimes);

        // 開始地点からの下へスクロールする速度(px/ms)を計算し、
        // その速度が変化するブラウザの画面のy座標と、変化前のスクロール速度を追加
        const blockVerocity: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.bpm) / 60000;
        if (blockVerocity !== verocity) {
          if (blockIdx > 0) {
            prev.borders.push(border);
            prev.verocities.push(verocity);
          }
          verocity = blockVerocity;
        }

        // 自動スクロール経過時間(ms)を必要に応じてインクリメント
        if (
          blockIdx === 0 &&
          document.documentElement.scrollTop > 0 &&
          block.delay > 0
        ) {
          prev.timestampOffset += block.delay;
        }
        if (
          border + unitRowHeight * block.rows <
          document.documentElement.scrollTop
        ) {
          prev.timestampOffset +=
            (60000 * block.rows) / (block.bpm * block.split);
        } else if (border < document.documentElement.scrollTop) {
          prev.timestampOffset +=
            (30000 * (document.documentElement.scrollTop - border)) /
            (noteSize * ZOOM_VALUES[zoom.idx] * block.bpm);
        }

        // 以下を譜面のブロック単位でインクリメント
        // * ブラウザの画面のy座標(px)
        // * 自動スクロール時間(ms)
        border += unitRowHeight * block.rows;
        accumulatedBeatTime += (60000 * block.rows) / (block.bpm * block.split);

        // 最後の譜面のブロックの下へスクロールする速度(px/ms)が変化するブラウザの画面のy座標とスクロール速度を追加
        if (blockIdx === blocks.length - 1) {
          prev.borders.push(border);
          prev.verocities.push(verocity);
        }

        return prev;
      },
      { borders: [], verocities: [], beatTimes: [], timestampOffset: 0 }
    );

    // 自動スクロール開始時におけるbeatTimesと、borders/verocitiesのインデックスをそれぞれ計算
    let beatTimeIdx: number = animationParam.beatTimes.findIndex(
      (beatTime: number) => beatTime >= animationParam.timestampOffset
    );
    if (beatTimeIdx === -1) {
      beatTimeIdx = animationParam.beatTimes.length;
    }
    let borderVerocityIdx: number = animationParam.borders.findIndex(
      (border: number) => border > document.documentElement.scrollTop
    );
    if (borderVerocityIdx === -1) {
      borderVerocityIdx = animationParam.borders.length;
    }

    // MP3ファイルの音楽の再生に必要な以下のパラメーターを計算する
    // * mp3When  : 再生してから実際に音が鳴るまでの遅延時間(秒)
    // * mp3Offset: 再生するmp3の音楽内での時刻(秒)
    const mp3When: number = Math.max(
      -1 * (animationParam.timestampOffset / 1000) -
        (blocks[0].delay < 0 ? blocks[0].delay / 1000 : 0),
      0
    );
    const mp3Offset: number = Math.max(
      animationParam.timestampOffset / 1000 +
        (blocks[0].delay < 0 ? blocks[0].delay / 1000 : 0),
      0
    );

    // 最初のスクロール・ビート音再生のアニメーション開始
    let requestId: number;
    let startTimestamp: number = 0;
    let prevTimestamp: number = 0;
    const animate = (timestamp: number) => {
      if (borderVerocityIdx === animationParam.verocities.length) {
        // 最後の譜面のブロックをスクロールし終えたらアニメーション停止
        stop();
      } else {
        // 最後のアニメーションのみタイムスタンプの初期値を設定
        if (startTimestamp === 0) {
          startTimestamp = timestamp;
        }
        if (prevTimestamp === 0) {
          prevTimestamp = timestamp;
        }

        // 最後のアニメーション開始時刻から現在のアニメーション開始時刻までの時間(ms)elapsedTimeを計算
        // 最初のアニメーションの場合は必ず0となり、以降の処理をバイパスする
        let elapsedTime: number = timestamp - prevTimestamp;
        prevTimestamp = timestamp;
        if (elapsedTime > 0) {
          // スクロール後のブラウザの画面のy座標(px)を計算し、スクロール速度を変更しながら下へスクロール
          while (borderVerocityIdx < animationParam.verocities.length) {
            if (
              top +
                animationParam.verocities[borderVerocityIdx] * elapsedTime <=
              animationParam.borders[borderVerocityIdx]
            ) {
              // スクロール前後で譜面のブロックを跨がらない場合は、スクロール後のブラウザの画面のy座標(px)の計算をして終了
              top += animationParam.verocities[borderVerocityIdx] * elapsedTime;
              break;
            } else {
              // スクロール前後で譜面のブロックを跨ぐ場合は、スクロール速度を変更しながらスクロール後のブラウザの画面のy座標(px)を再計算
              elapsedTime -=
                (animationParam.borders[borderVerocityIdx] - top) /
                animationParam.verocities[borderVerocityIdx];
              top = animationParam.borders[borderVerocityIdx];
              borderVerocityIdx += 1;
            }
          }
          window.scrollTo({ top, behavior: "instant" });

          // ビート音の再生
          if (
            beatTimeIdx < animationParam.beatTimes.length &&
            animationParam.beatTimes[beatTimeIdx] <=
              animationParam.timestampOffset + timestamp - startTimestamp &&
            audioContext.current &&
            beatGainNode.current
          ) {
            beatSourceNode.current = audioContext.current.createBufferSource();
            beatSourceNode.current.buffer = beatAudioBuffer.current;
            beatSourceNode.current.connect(beatGainNode.current);
            beatGainNode.current.connect(audioContext.current.destination);
            beatSourceNode.current.start();
            beatTimeIdx += 1;
          }
        } else if (audioContext.current && musicGainNode.current) {
          // 最初のアニメーションでMP3ファイルの音楽を再生する
          musicSourceNode.current = audioContext.current.createBufferSource();
          musicSourceNode.current.buffer = musicAudioBuffer.current;
          musicSourceNode.current.connect(musicGainNode.current);
          musicGainNode.current.connect(audioContext.current.destination);
          musicSourceNode.current.start(
            mp3When > 0 ? mp3When + audioContext.current.currentTime : 0,
            mp3Offset
          );
          audioContext.current.currentTime;
        }

        // 次のスクロール・ビート音再生のアニメーション開始
        requestId = window.requestAnimationFrame(animate);
      }
    };
    requestId = window.requestAnimationFrame(animate);

    return () => {
      // スクロール・ビート音再生のアニメーションの停止
      cancelAnimationFrame(requestId);

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
  }, [blocks, isPlaying, noteSize, notes, stop, zoom.idx]);

  return { isUploadingMP3, onUploadMP3, start, stop };
}

export default usePlaying;
