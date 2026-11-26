// Web Audio API Synthesizer for 2048 Neon Fusion
// Zero external audio files (0 kB download) - pure client-side mathematical synthesis

class Neon2048Audio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tappyard-2048-mute');
        this.isMuted = saved === 'true';
      } catch {
        this.isMuted = false;
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          this.ctx = new AudioCtxClass();
        } catch {
          return null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tappyard-2048-mute', String(muted));
      } catch {
        // ignore storage quota/privacy block
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Soft tactile slide whoosh
  public slide(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable
    }
  }

  // Musical pentatonic merge chime that scales with tile value
  public merge(value: number, comboIndex: number = 0): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      // Pentatonic pitch map based on tile value
      const pitchMap: Record<number, number> = {
        4: 261.63,   // C4
        8: 293.66,   // D4
        16: 329.63,  // E4
        32: 392.00,  // G4
        64: 440.00,  // A4
        128: 523.25, // C5
        256: 587.33, // D5
        512: 659.25, // E5
        1024: 783.99,// G5
        2048: 880.00,// A5
        4096: 1046.50// C6
      };

      const baseFreq = pitchMap[value] || (value > 4096 ? 1318.51 : 220);
      const comboMultiplier = Math.pow(1.05946, comboIndex * 2); // Micro semi-tone escalation on multi-merges
      const finalFreq = baseFreq * comboMultiplier;

      // Primary chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = value >= 128 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(finalFreq, ctx.currentTime);

      // Add soft harmonic overtone for high-tier tiles
      if (value >= 64) {
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(finalFreq * 2, ctx.currentTime);

        overtoneGain.gain.setValueAtTime(0.06, ctx.currentTime);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        overtone.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);
        overtone.start();
        overtone.stop(ctx.currentTime + 0.26);
      }

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.29);
    } catch {
      // AudioContext unavailable
    }
  }

  // Rewind / Undo sound
  public undo(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // AudioContext unavailable
    }
  }

  // Game over descending tone
  public gameOver(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [392, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4
      notes.forEach((freq, idx) => {
        const startTime = ctx.currentTime + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // 2048 Win celebratory fanfare chord
  public win(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      chord.forEach((freq, idx) => {
        const startTime = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const neon2048Audio = new Neon2048Audio();
