import { useCallback, useEffect, useRef, useState } from "react";
import { BEAT_BINARY, ZOOM_VALUES } from "../services/assets";
import { Block, Note } from "../types/ucs";
import { useStore } from "./useStore";

function usePlaying() {
  const {
    blocks,
    isMuteBeats,
    isPlaying,
    setIsPlaying,
    noteSize,
    setMp3Name,
    notes,
    setSuccessMessage,
    setUserErrorMessage,
    volumeValue,
    zoom,
  } = useStore();
  const [isUploadingMP3, setIsUploadingMP3] = useState<boolean>(false);

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
    // Decode and load beat.wav if it has not been decoded and loaded
    if (beatAudioBuffer.current === null) {
      fetch(BEAT_BINARY)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          // Initialize AudioContext if it has not been initialized
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
          }

          // Initialize GainNode for beat sound if it has not been initialized
          if (beatGainNode.current === null) {
            beatGainNode.current = audioContext.current.createGain();
            beatGainNode.current.gain.value = isMuteBeats ? 0 : volumeValue;
          }

          return audioContext.current.decodeAudioData(arrayBuffer);
        })
        .then(
          (decodedAudio: AudioBuffer) =>
            (beatAudioBuffer.current = decodedAudio),
        );
    }

    setIsPlaying(true);
  };

  const stop = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  // Dynamically set the volume for beat sound from 0 (mute) to 1 (MAX)
  useEffect(() => {
    if (beatGainNode.current !== null) {
      beatGainNode.current.gain.value = isMuteBeats ? 0 : volumeValue;
    }
  }, [isMuteBeats, volumeValue]);

  const onUploadMP3 = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // NOP if no MP3 file was uploaded
      const fileList: FileList | null = event.target.files;
      if (!fileList || fileList.length === 0) return;

      // Check the extension
      if (fileList[0].name.split(".").pop() !== "mp3") {
        setUserErrorMessage("Extension is not mp3");
        return;
      }

      // Decode and load the uploaded MP3 file
      setIsUploadingMP3(true);
      fileList[0]
        .arrayBuffer()
        .then((arrayBuffer: ArrayBuffer) => {
          // Initialize AudioContext if it has not been initialized
          if (audioContext.current === null) {
            audioContext.current = new AudioContext();
          }

          // Initialize GainNode for MP3 file music if it has not been initialized
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

          // Initialize to allow the same MP3 file to be uploaded again
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
    ],
  );

  // Dynamically set the volume for MP3 file music from 0 (mute) to 1 (MAX)
  useEffect(() => {
    if (musicGainNode.current !== null) {
      musicGainNode.current.gain.value = volumeValue;
    }
  }, [volumeValue]);

  // Prevent manual vertical scrolling during playback
  useEffect(() => {
    document.body.style.overflowY = isPlaying ? "hidden" : "scroll";
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // Initialize the browser window y-coordinate at the automatic scroll start point
    // Use the current browser window y-coordinate if it is not at the top;
    // if it is at the top and Delay of the first chart block is positive, subtract the time needed to delay beat sound playback
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

    // Calculate the browser window y-coordinate when beat sound playback timing or downward scroll speed (px/ms) changes,
    // and the elapsed automatic scroll time (seconds) according to the current browser window y-coordinate
    let verocity: number = -1;
    let border: number = 0;
    type ScrollParam = {
      beatTops: number[];
      verocities: { verocity: number; border: number }[];
      elapsedMusicTime: number;
    };
    const scrollParam: ScrollParam = blocks.reduce(
      (prev: ScrollParam, block: Block, blockIdx: number) => {
        // Calculate the height (px) per row of each chart block
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

        // Extract row indexes in the entire chart for each column at single note or starting point of hold
        const filteredStarts: number[][] = notes.map((notes: Note[]) =>
          notes
            .filter(
              (note: Note) =>
                ["X", "M"].includes(note.type) &&
                note.rowIdx >= block.accumulatedRows &&
                note.rowIdx < block.accumulatedRows + block.rows,
            )
            .map((note: Note) => note.rowIdx),
        );
        // Add browser window y-coordinates when beat sound plays
        const tops: number[] = [
          ...new Set<number>(filteredStarts.flat()), // Flatten and remove duplicates
        ]
          .sort((a: number, b: number) => a - b) // Sort row indexes in the entire chart in ascending order
          .map(
            (rowIdx: number) =>
              border + unitRowHeight * (rowIdx - block.accumulatedRows),
          );
        prev.beatTops = prev.beatTops.concat(tops);

        // Calculate the downward scroll speed (px/ms) from the start point
        // and add the browser window y-coordinate where that speed changes
        const blockVerocity: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.bpm) / 60000;
        if (blockVerocity !== verocity) {
          if (blockIdx > 0) {
            prev.verocities.push({ verocity, border });
          }
          verocity = blockVerocity;
        }

        // Add elapsed automatic scroll time (seconds) according to the current browser window y-coordinate
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

        // Increment by the chart block height (px)
        border += unitRowHeight * block.rows;

        // Add the browser window y-coordinate where the downward scroll speed (px/ms) changes for the last chart block
        if (blockIdx === blocks.length - 1) {
          prev.verocities.push({ verocity, border });
        }

        return prev;
      },
      { elapsedMusicTime: 0, beatTops: [], verocities: [] },
    );

    // Calculate the automatic scroll start index for when beat sound plays
    // and when downward scroll speed (px/ms) changes
    let beatTopIdx: number = scrollParam.beatTops.findIndex(
      (value: number) => value > document.documentElement.scrollTop,
    );
    if (beatTopIdx === -1) {
      beatTopIdx = scrollParam.beatTops.length;
    }
    let verocityIdx: number = scrollParam.verocities.findIndex(
      (value: { verocity: number; border: number }) =>
        value.border > document.documentElement.scrollTop,
    );
    if (verocityIdx === -1) {
      verocityIdx = scrollParam.verocities.length;
    }

    // Play MP3 file music
    if (audioContext.current && musicGainNode.current) {
      musicSourceNode.current = audioContext.current.createBufferSource();
      musicSourceNode.current.buffer = musicAudioBuffer.current;
      musicSourceNode.current.connect(musicGainNode.current);
      musicGainNode.current.connect(audioContext.current.destination);
      musicSourceNode.current.start(
        // If Delay of the first chart block is negative, delay the time until MP3 file music plays
        // according to the elapsed automatic scroll time (seconds) for the current browser window y-coordinate
        blocks[0].delay < 0 &&
          blocks[0].delay / 1000 + scrollParam.elapsedMusicTime < 0
          ? (-1 * blocks[0].delay) / 1000 - scrollParam.elapsedMusicTime
          : 0,
        // Set the offset to play MP3 file music according to the elapsed automatic scroll time (seconds)
        // for the current browser window y-coordinate
        scrollParam.elapsedMusicTime > 0 &&
          blocks[0].delay / 1000 + scrollParam.elapsedMusicTime > 0
          ? blocks[0].delay / 1000 + scrollParam.elapsedMusicTime
          : 0,
      );
    }

    // Start automatic scrolling at 60 FPS
    const FPS: number = 60;
    previousScrollTime.current = Date.now();
    const scrollIntervalId: ReturnType<typeof setInterval> = setInterval(() => {
      if (verocityIdx === scrollParam.verocities.length) {
        // Stop after scrolling through the last chart block
        stop();
      } else {
        // Calculate elapsedScrollTime, the time (ms) between the last scroll time and the current time
        // This time theoretically matches 1000 / FPS, but does not always match in actual behavior
        currentScrollTime.current = Date.now();
        let elapsedScrollTime: number =
          currentScrollTime.current - previousScrollTime.current;
        previousScrollTime.current = currentScrollTime.current;

        // Calculate the browser window y-coordinate (px) after scrolling and scroll downward while changing scroll speed
        while (verocityIdx < scrollParam.verocities.length) {
          if (
            top +
              scrollParam.verocities[verocityIdx].verocity *
                elapsedScrollTime <=
            scrollParam.verocities[verocityIdx].border
          ) {
            // If scrolling does not cross a chart block, calculate the browser window y-coordinate (px) after scrolling and finish
            top +=
              scrollParam.verocities[verocityIdx].verocity * elapsedScrollTime;
            break;
          } else {
            // If scrolling crosses a chart block, recalculate the browser window y-coordinate (px) after scrolling while changing scroll speed
            elapsedScrollTime -=
              (scrollParam.verocities[verocityIdx].border - top) /
              scrollParam.verocities[verocityIdx].verocity;
            top = scrollParam.verocities[verocityIdx].border;
            verocityIdx += 1;
          }
        }
        window.scrollTo({ top, behavior: "instant" });

        // Play beat sound according to the browser window y-coordinate
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
      // Stop automatic scrolling
      clearInterval(scrollIntervalId);

      // Stop beat sound playback
      if (beatSourceNode.current) {
        beatSourceNode.current.stop();
        beatSourceNode.current.disconnect();
      }
      if (beatGainNode.current) {
        beatGainNode.current.disconnect();
      }

      // Stop MP3 file music playback
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
