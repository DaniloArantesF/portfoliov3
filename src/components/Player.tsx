import { atom } from 'nanostores';
import { useGUI } from '../lib/sceneController';

const gui = useGUI.get();

export const BIN_COUNT = 32;

class Player {
  private static player: Player;
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  gainNode: GainNode | null = null;
  source: MediaElementAudioSourceNode | null = null;
  buffer: Uint8Array;
  audio: HTMLAudioElement;
  fftSize: number;

  // Low-pass filter
  iirfilter: IIRFilterNode | null = null;
  iirFilterEnabled = true;
  lowPassCoefficients = {
    feedforward: [1],
    feedback: [1, -0.5],
  };

  private constructor() {
    this.audio = document.querySelector('audio')!;
    this.audio.volume = 0.4;

    this.fftSize = BIN_COUNT * 2;
    this.buffer = new Uint8Array(this.fftSize);
    this.loadDefaultSong();
    this.setupGUI();
  }

  // Init context is called on user input to avoid issues on mobile
  public initContext = () => {
    let AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaElementSource(this.audio);

    // Exposes audio time and frequency data
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;

    this.gainNode = this.audioContext.createGain();
    this.iirfilter = new IIRFilterNode(this.audioContext, {
      feedforward: this.lowPassCoefficients.feedforward,
      feedback: this.lowPassCoefficients.feedback,
    });

    // Pipe audio through nodes
    if (this.iirFilterEnabled) {
      this.source
        .connect(this.iirfilter)
        .connect(this.gainNode)
        .connect(this.analyser)
        .connect(this.audioContext.destination);
    } else {
      this.source
        .connect(this.gainNode)
        .connect(this.analyser)
        .connect(this.audioContext.destination);
    }

    // Frequency buffer, frequencyBinCount == fftSize / 2
    this.buffer = new Uint8Array(this.analyser.frequencyBinCount);
  };

  public toggleIirFilter(status = !this.iirFilterEnabled) {
    if (!this.source || !this.iirfilter) return;
    this.iirFilterEnabled = status;
    if (this.iirFilterEnabled) {
      this.source.disconnect(this.gainNode!);
      this.source
        .connect(this.iirfilter)
        .connect(this.gainNode!)
        .connect(this.analyser!)
        .connect(this.audioContext!.destination);
    } else {
      this.source.disconnect(this.iirfilter);
      this.source
        .connect(this.gainNode!)
        .connect(this.analyser!)
        .connect(this.audioContext!.destination);
    }
  }

  private setupGUI = () => {
    const audioFolder = gui.addFolder({ title: 'AudioPlayer' });
    const params = {
      volume: 1,
    };
    audioFolder
      .addInput(params, 'volume', {
        title: 'Gain',
        min: 0,
        max: 5,
        step: 0.01,
      })
      .on(
        'change',
        ({ value }) => this.gainNode && (this.gainNode.gain.value = value),
      );

    const toggleFilterButton = audioFolder.addButton({
      title: 'Toggle iirFilter',
    });
    toggleFilterButton.on('click', () => this.toggleIirFilter());
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
