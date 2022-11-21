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

  public static initContext = () => {
    const player = Player.getInstance();
    let AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    player.audioContext = new AudioContext();
    player.source = player.audioContext.createMediaElementSource(player.audio);

    // exposes audio time and frequency data
    player.analyser = player.audioContext.createAnalyser();

    // pipe audio source through analyzer
    player.source.connect(player.analyser);

    // output audio to default speaker device
    player.analyser.connect(player.audioContext.destination);
    player.analyser.fftSize = 256; // sampling rate

    // array holding 8-bit integers representing frequencies
    // analyser.frequencyBinCount is equal to fftSize / 2
    player.buffer = new Uint8Array(player.analyser.frequencyBinCount);
  };

  public static getInstance = () => {
    if (!Player.player) {
      Player.player = new Player();
    }
    return Player.player;
  };

  private loadDefaultSong() {
    this.audio.src = '/assets/songs/song1.mp3';
    this.audio.load();
  }
}

export default Player;
