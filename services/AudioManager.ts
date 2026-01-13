
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
    this.reverbBus.delayTime.value = 0.42; // Precisely tuned for cavernous reflections
    
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.48; // Echo persistence
    
    const echoFilter = this.ctx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.value = 900; // Slightly brighter for "wet" reflections

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
   * Footstep: Leather shoe in a damp cave.
   * Layers: Firm heel strike + Wet squelch + Leather creak + Echo
   */
  static playFootstep() {
    if (!this.ctx || !this.masterBus || !this.reverbBus) return;
    const now = this.ctx.currentTime;

    // 1. Leather Heel Strike (The Thud)
    const heel = this.ctx.createOscillator();
    const heelGain = this.ctx.createGain();
    heel.type = 'sine';
    heel.frequency.setValueAtTime(65, now);
    heel.frequency.exponentialRampToValueAtTime(35, now + 0.08);
    heelGain.gain.setValueAtTime(0.35, now);
    heelGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    heel.connect(heelGain);
    heelGain.connect(this.masterBus);
    heelGain.connect(this.reverbBus); // Send to echo
    heel.start(now);
    heel.stop(now + 0.1);

    // 2. The Damp Squelch (Wetness/Slap)
    const squelchBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
    const squelchData = squelchBuffer.getChannelData(0);
    for (let i = 0; i < squelchData.length; i++) squelchData[i] = Math.random() * 2 - 1;
    const squelchSource = this.ctx.createBufferSource();
    squelchSource.buffer = squelchBuffer;

    const squelchFilter = this.ctx.createBiquadFilter();
    squelchFilter.type = 'bandpass';
    squelchFilter.frequency.value = 3200;
    squelchFilter.Q.value = 2;

    const squelchGain = this.ctx.createGain();
    squelchGain.gain.setValueAtTime(0.07, now);
    squelchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    squelchSource.connect(squelchFilter);
    squelchFilter.connect(squelchGain);
    squelchGain.connect(this.masterBus);
    squelchSource.start(now);

    // 3. Leather Creak (Friction)
    const creak = this.ctx.createOscillator();
    const creakGain = this.ctx.createGain();
    creak.type = 'triangle';
    creak.frequency.setValueAtTime(800, now + 0.01);
    creak.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
    creakGain.gain.setValueAtTime(0.03, now + 0.01);
    creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    creak.connect(creakGain);
    creakGain.connect(this.masterBus);
    creak.start(now + 0.01);
    creak.stop(now + 0.05);
  }

  /**
   * Realistic Key Sound: A sharp, rapid cluster of metallic clinks
   */
  static playPickupKey() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;

    const numClinks = 9;
    for (let i = 0; i < numClinks; i++) {
      const startTime = now + (i * 0.012) + (Math.random() * 0.01);
      const freq = 2500 + Math.random() * 4000;
      
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = 'sine';
      ring.frequency.setValueAtTime(freq, startTime);
      ring.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.05);
      
      ringGain.gain.setValueAtTime(0.12, startTime);
      ringGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04 + Math.random() * 0.04);
      
      ring.connect(ringGain);
      ringGain.connect(this.masterBus);
      ring.start(startTime);
      ring.stop(startTime + 0.1);

      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.005, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 7000;
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.008);

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
