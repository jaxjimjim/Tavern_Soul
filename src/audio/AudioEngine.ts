// Simple Audio Engine wrapper for Web Audio API

export class AudioEngine {
  private ctx: AudioContext;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.ctx = new AudioContext();
  }

  // Placeholder for crossfade and EQ logic
  async loadTrack(url: string) {
    // 1. fetch array buffer
    // 2. decodeAudioData
    // 3. createBufferSource
  }

  play() {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // play source
  }

  pause() {
    this.ctx.suspend();
  }
}

export const audioEngine = new AudioEngine();
