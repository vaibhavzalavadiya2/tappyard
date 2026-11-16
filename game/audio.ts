// Audio manager - generates juicy procedural arcade sounds using Web Audio API for Jump Jelly Jump
export class AudioManager {
  private ctx: AudioContext | null = null;
  private muted = false;
  private initialized = false;
  private diamondCombo = 0;
  private lastDiamondTime = 0;

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch {
      console.warn('Web Audio API not available');
    }
  }

  get isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(val: boolean) {
    this.muted = val;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.15,
    detune = 0
  ) {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.detune.value = detune;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  // Speed Chevron booster pad launch sound - exhilarating surge & laser sparkle
  boost(streak = 1) {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    const pitchShift = Math.min(streak * 30, 240);

    osc.frequency.setValueAtTime(140 + pitchShift, t);
    osc.frequency.exponentialRampToValueAtTime(580 + pitchShift, t + 0.35);

    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.28);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);

    // Sparkle chime overlay
    setTimeout(() => this.playTone(880 + pitchShift, 0.18, 'sine', 0.14), 60);
    setTimeout(() => this.playTone(1320 + pitchShift, 0.22, 'sine', 0.12), 120);
    setTimeout(() => this.playTone(1760 + pitchShift, 0.25, 'triangle', 0.1), 180);
  }

  // Cyan diamond collectible chime - pentatonic scale dopamine progression
  diamond() {
    const now = Date.now();
    if (now - this.lastDiamondTime < 1400) {
      this.diamondCombo = Math.min(this.diamondCombo + 1, 7);
    } else {
      this.diamondCombo = 0;
    }
    this.lastDiamondTime = now;

    // Pentatonic scale: D6, E6, G6, A6, C7, D7, E7, G7
    const scale = [1174.66, 1318.51, 1567.98, 1760.0, 2093.0, 2349.32, 2637.02, 3135.96];
    const freq = scale[this.diamondCombo];

    // Crystal bell sound: fundamental + octave overtone
    this.playTone(freq, 0.14, 'sine', 0.16);
    this.playTone(freq * 2, 0.1, 'sine', 0.08);
  }

  // Safe landing after booster jump - punchy bass thump + cushion
  land() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);

    // Subtle cushion noise
    this.playTone(220, 0.08, 'triangle', 0.07);
  }

  // Near-miss / edge scrape warning
  edgeScrape() {
    this.playTone(320, 0.06, 'sawtooth', 0.08);
  }

  // Distance milestone celebration fanfare
  milestone() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.28, 'triangle', 0.15);
        this.playTone(f * 2, 0.2, 'sine', 0.08);
      }, i * 75);
    });
  }

  // Fall into the void
  fall() {
    if (this.muted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // Environment theme change harmonic chord
  themeShift() {
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.4, 'sine', 0.12), i * 80);
    });
  }

  newRecord() {
    this.milestone();
  }

  buttonClick() {
    this.playTone(880, 0.05, 'sine', 0.08);
  }

  // Backward-compat aliases
  bounce() {
    this.boost();
  }

  combo(streak: number) {
    this.boost(streak);
  }

  perfectLanding() {
    this.land();
  }
}

// Singleton
export const audioManager = new AudioManager();
