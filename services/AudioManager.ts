
export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static masterBus: GainNode | null = null;
  private static reverbBus: DelayNode | null = null;

  private static init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Master output
    this.masterBus = this.ctx.createGain();
    this.masterBus.gain.value = 0.25;
    this.masterBus.connect(this.ctx.destination);

    // Cavern Echo Setup (Feedback Delay Line)
    this.reverbBus = this.ctx.createDelay(2.0);
    this.reverbBus.delayTime.value = 0.45; // Delay time for cavern reflections
    
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.5; // Echo persistence
    
    const echoFilter = this.ctx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.value = 700; // Muffled reflections of stone

    this.reverbBus.connect(echoFilter);
    echoFilter.connect(feedback);
    feedback.connect(this.reverbBus);
    this.reverbBus.connect(this.masterBus);
  }

  static async resume() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Footstep: A stony thud + grit + cavern reflection
   */
  static playFootstep() {
    if (!this.ctx || !this.masterBus || !this.reverbBus) return;
    const now = this.ctx.currentTime;

    // 1. Low Thud (The impact)
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(70, now);
    thud.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    thudGain.gain.setValueAtTime(0.3, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    thud.connect(thudGain);
    thudGain.connect(this.masterBus);
    thudGain.connect(this.reverbBus); // Send to cavern echo
    thud.start(now);
    thud.stop(now + 0.1);

    // 2. The Grit (Friction on stone)
    const noise = this.ctx.createBufferSource();
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1200;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterBus);
    noise.start(now);
  }

  /**
   * Realistic Key Sound: Multiple randomized metallic clinks
   */
  static playPickupKey() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;

    // Trigger 6 distinct "clinks" to simulate a bundle of keys rattling
    for (let i = 0; i < 6; i++) {
      const startTime = now + (i * 0.02) + (Math.random() * 0.03);
      const freq = 2000 + Math.random() * 3500;
      
      // The high-pitched ring
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = 'sine';
      ring.frequency.setValueAtTime(freq, startTime);
      ringGain.gain.setValueAtTime(0.1, startTime);
      ringGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      
      ring.connect(ringGain);
      ringGain.connect(this.masterBus);
      ring.start(startTime);
      ring.stop(startTime + 0.12);

      // The metallic transient (click)
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.01, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 5000;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.01);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterBus);
      noise.start(startTime);
    }
  }

  static playPickupLantern() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(this.masterBus);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  static playPotion() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.masterBus);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  static playWind() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    const duration = 8;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) d[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 0.5;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + duration / 2);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + duration / 2);
    filter.frequency.exponentialRampToValueAtTime(250, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterBus);

    noise.start(now);
    noise.stop(now + duration);
  }
}
