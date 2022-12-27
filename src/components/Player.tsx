import { atom } from 'nanostores';

class Player {
  private static player: Player;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  source: MediaElementAudioSourceNode | null;
  buffer: Uint8Array;
  audio: HTMLAudioElement;

  private constructor() {
    this.audio = document.querySelector('audio')!;
    this.audio.volume = 0.4;
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.buffer = new Uint8Array(128);
    this.loadDefaultSong();
  }

  public initContext = () => {
    let AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaElementSource(this.audio);

    // exposes audio time and frequency data
    this.analyser = this.audioContext.createAnalyser();

    // pipe audio source through analyzer
    this.source.connect(this.analyser);

    // output audio to default speaker device
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 64; // sampling rate

    // array holding 8-bit integers representing frequencies
    // analyser.frequencyBinCount is equal to fftSize / 2
    this.buffer = new Uint8Array(this.analyser.frequencyBinCount);
  };

  public static getInstance = () => {
    if (!Player.player) {
      Player.player = new Player();
    }
    return Player.player;
  };

  public loadDefaultSong() {
    this.audio.src = '/assets/songs/song1.mp3';
    this.audio.load();
  }
}

export const usePlayer = atom<Player>(Player.getInstance());
export default Player;
