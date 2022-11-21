import React, { useEffect, useRef, useState } from 'react';
import '../styles/player.scss';
import { clamp } from '../util/math';
import { msToMinSec } from '../util/time';
import player from './Player';

// frequency player controller will update progress
const POOLING_RATE = 1000;

export function PlayerController() {
  const audioRef = useRef<HTMLAudioElement>(document.querySelector('audio'));
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressInterval = useRef<NodeJS.Timer>();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef(player.getInstance());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    const audioEl = audioRef.current;
    setPlaying(!audioEl.paused);

    audioEl.addEventListener('play', function () {
      setPlaying(true);
      progressInterval.current = setInterval(
        () => setProgress((p) => p + POOLING_RATE),
        POOLING_RATE,
      );
    });

    audioEl.addEventListener('loadeddata', function () {
      setLoaded(true);
    });

    audioEl.addEventListener('pause', function () {
      setPlaying(false);
      clearInterval(progressInterval.current!);
    });

    audioEl.addEventListener('ended', function () {
      clearInterval(progressInterval.current!);
      setProgress(0);
      audioEl.currentTime = 0;
      setPlaying(false);
    });

    audioEl.addEventListener('durationchange', function (e) {
      setProgress(0);
      setDuration(audioEl.duration);
      clearInterval(progressInterval.current!);
      setPlaying(false);
    });

    // Handle file upload
    const fileInput = document.getElementById('fileIn');
    fileInput?.addEventListener('change', function (event) {
      const el = event.target as HTMLInputElement;
      if (el && el.files) {
        const file = el.files[0];
        audioEl.src = URL.createObjectURL(file);
        audioEl.load();
      }
    });

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  useEffect(() => {
    thumbRef.current!.style.width = `${progress / (10 * duration)}%`;
  }, [progress]);

  function handlePlay() {
    if (!loaded) return;
    if (!playerRef.current.audioContext) {
      player.initContext();
    }

    audioRef.current?.play();
  }

  function handlePause() {
    if (!loaded) return;
    audioRef.current?.pause();
  }

  // TODO: handle seek when mouse leaves container
  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const { left, width } = progressBarRef.current!.getBoundingClientRect();
    const mouseX = event.clientX - left;
    const mousePct = clamp((100 * mouseX) / width, 0, 100);
    audioRef.current!.currentTime = (duration * mousePct) / 100;
    setProgress(((duration * mousePct) / 100) * 1000);
  }

  return (
    <div id="player-container">
      <div id="plauer-status">
        <span>{msToMinSec(progress)}</span>
        <div
          id="progress-bar"
          ref={progressBarRef}
          onDragEnd={handleSeek}
          onClick={handleSeek}
        >
          <span id="track" />
          <span id="thumb" ref={thumbRef} />
        </div>
        <span>{msToMinSec(duration * 1000)}</span>
      </div>

      <div id="player-controls">
        <div>
          <label
            htmlFor="fileIn"
            className="file_input"
            onClick={(e) => {
              e.preventDefault();
              inputRef.current!.click();
            }}
          >
            Import
          </label>
          <input ref={inputRef} type="file" id="fileIn" />
        </div>

        {playing ? (
          <button className="icon" onClick={handlePause}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        ) : (
          <button className="icon" onClick={handlePlay}>
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default PlayerController;
