
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
    feedback.gain.value = 0.35; // Echo persistence (reduced from 0.48 for tighter cavernous feel)
    
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
   * Footstep: Hard-soled leather shoes on wet rainy stone slabs.
   * Multi-layered physical model:
   * 1. Heavy stone slab body thuds (deep low-mid impact resonance)
   * 2. Crisp hard leather heel strike & toe clack transients
   * 3. Micro wet compression sizzles (the rapid "squish/spit" of thin moisture on hard stone)
   * 4. Rich spatial reverberation mimicking damp gothic stone hallways
   */
  static playFootstep() {
    if (!this.ctx || !this.masterBus || !this.reverbBus) return;
    const now = this.ctx.currentTime;

    // Reducer for footstep echo: send only 20% of the impact signal to reverb
    const reverbSend = this.ctx.createGain();
    reverbSend.gain.setValueAtTime(0.20, now);
    reverbSend.connect(this.reverbBus);

    // --- 1. HEEL STRIKE (t = now) ---
    const heelTime = now;

    // A. Deep Solid Stone Slab Thud (Low-mid resonance)
    const heelStone = this.ctx.createOscillator();
    const heelStoneGain = this.ctx.createGain();
    heelStone.type = 'triangle';
    heelStone.frequency.setValueAtTime(110, heelTime);
    heelStone.frequency.exponentialRampToValueAtTime(55, heelTime + 0.05);
    heelStoneGain.gain.setValueAtTime(0.15, heelTime);
    heelStoneGain.gain.exponentialRampToValueAtTime(0.001, heelTime + 0.06);
    heelStone.connect(heelStoneGain);
    heelStoneGain.connect(this.masterBus);
    heelStoneGain.connect(reverbSend);
    heelStone.start(heelTime);
    heelStone.stop(heelTime + 0.06);

    // B. Heel Leather Body Tap (Mid resonance)
    const heelLeather = this.ctx.createOscillator();
    const heelLeatherGain = this.ctx.createGain();
    heelLeather.type = 'sine';
    heelLeather.frequency.setValueAtTime(190, heelTime);
    heelLeather.frequency.exponentialRampToValueAtTime(95, heelTime + 0.035);
    heelLeatherGain.gain.setValueAtTime(0.12, heelTime);
    heelLeatherGain.gain.exponentialRampToValueAtTime(0.001, heelTime + 0.04);
    heelLeather.connect(heelLeatherGain);
    heelLeatherGain.connect(this.masterBus);
    heelLeatherGain.connect(reverbSend);
    heelLeather.start(heelTime);
    heelLeather.stop(heelTime + 0.04);

    // C. Crisp Leather-on-Stone High Clack (Sharp click transient)
    const heelClackBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.015, this.ctx.sampleRate);
    const heelClackData = heelClackBuffer.getChannelData(0);
    for (let i = 0; i < heelClackData.length; i++) heelClackData[i] = Math.random() * 2 - 1;
    const heelClackSource = this.ctx.createBufferSource();
    heelClackSource.buffer = heelClackBuffer;

    const heelClackFilter = this.ctx.createBiquadFilter();
    heelClackFilter.type = 'bandpass';
    heelClackFilter.frequency.value = 3400;
    heelClackFilter.Q.value = 4.0;

    const heelClackGain = this.ctx.createGain();
    heelClackGain.gain.setValueAtTime(0.15, heelTime);
    heelClackGain.gain.exponentialRampToValueAtTime(0.001, heelTime + 0.012);

    heelClackSource.connect(heelClackFilter);
    heelClackFilter.connect(heelClackGain);
    heelClackGain.connect(this.masterBus);
    heelClackGain.connect(reverbSend);
    heelClackSource.start(heelTime);

    // D. Damp Rainy Moisture Squeal/Splat (Ultra-rapid wet compression sizzle)
    const heelWetBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.025, this.ctx.sampleRate);
    const heelWetData = heelWetBuffer.getChannelData(0);
    for (let i = 0; i < heelWetData.length; i++) {
      // White noise base with custom damping decay profile
      heelWetData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.006));
    }
    const heelWetSource = this.ctx.createBufferSource();
    heelWetSource.buffer = heelWetBuffer;

    const heelWetFilter = this.ctx.createBiquadFilter();
    heelWetFilter.type = 'bandpass';
    heelWetFilter.frequency.value = 2200; // Wet splat/spray resonance zone
    heelWetFilter.Q.value = 3.0;

    const heelWetGain = this.ctx.createGain();
    heelWetGain.gain.setValueAtTime(0.08, heelTime);
    heelWetGain.gain.exponentialRampToValueAtTime(0.001, heelTime + 0.025);

    heelWetSource.connect(heelWetFilter);
    heelWetFilter.connect(heelWetGain);
    heelWetGain.connect(this.masterBus);
    heelWetSource.start(heelTime);

    // --- 2. TOE ROLL/TAP (t = now + 0.045) ---
    const toeTime = now + 0.045;

    // A. Toe Leather Body Tap (Higher pitch mid resonance)
    const toeLeather = this.ctx.createOscillator();
    const toeLeatherGain = this.ctx.createGain();
    toeLeather.type = 'sine';
    toeLeather.frequency.setValueAtTime(250, toeTime);
    toeLeather.frequency.exponentialRampToValueAtTime(140, toeTime + 0.025);
    toeLeatherGain.gain.setValueAtTime(0.08, toeTime);
    toeLeatherGain.gain.exponentialRampToValueAtTime(0.001, toeTime + 0.03);
    toeLeather.connect(toeLeatherGain);
    toeLeatherGain.connect(this.masterBus);
    toeLeatherGain.connect(reverbSend);
    toeLeather.start(toeTime);
    toeLeather.stop(toeTime + 0.03);

    // B. Crisp Toe High Tock (Sharp click transient)
    const toeClackBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.01, this.ctx.sampleRate);
    const toeClackData = toeClackBuffer.getChannelData(0);
    for (let i = 0; i < toeClackData.length; i++) toeClackData[i] = Math.random() * 2 - 1;
    const toeClackSource = this.ctx.createBufferSource();
    toeClackSource.buffer = toeClackBuffer;

    const toeClackFilter = this.ctx.createBiquadFilter();
    toeClackFilter.type = 'bandpass';
    toeClackFilter.frequency.value = 4000;
    toeClackFilter.Q.value = 4.5;

    const toeClackGain = this.ctx.createGain();
    toeClackGain.gain.setValueAtTime(0.10, toeTime);
    toeClackGain.gain.exponentialRampToValueAtTime(0.001, toeTime + 0.008);

    toeClackSource.connect(toeClackFilter);
    toeClackFilter.connect(toeClackGain);
    toeClackGain.connect(this.masterBus);
    toeClackGain.connect(reverbSend);
    toeClackSource.start(toeTime);

    // C. Damp Rainy Moisture Toe Squeeze (Ultra-rapid wet sizzle)
    const toeWetBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.015, this.ctx.sampleRate);
    const toeWetData = toeWetBuffer.getChannelData(0);
    for (let i = 0; i < toeWetData.length; i++) {
      toeWetData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.004));
    }
    const toeWetSource = this.ctx.createBufferSource();
    toeWetSource.buffer = toeWetBuffer;

    const toeWetFilter = this.ctx.createBiquadFilter();
    toeWetFilter.type = 'bandpass';
    toeWetFilter.frequency.value = 2500;
    toeWetFilter.Q.value = 4.0;

    const toeWetGain = this.ctx.createGain();
    toeWetGain.gain.setValueAtTime(0.05, toeTime);
    toeWetGain.gain.exponentialRampToValueAtTime(0.001, toeTime + 0.015);

    toeWetSource.connect(toeWetFilter);
    toeWetFilter.connect(toeWetGain);
    toeWetGain.connect(this.masterBus);
    toeWetSource.start(toeTime);
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

  static playHit() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    
    // Low blunt thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterBus);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  static playHurt() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(90, now);
    osc1.frequency.linearRampToValueAtTime(50, now + 0.25);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(95, now);
    osc2.frequency.linearRampToValueAtTime(45, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterBus);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  static playDescend() {
    if (!this.ctx || !this.masterBus || !this.reverbBus) return;
    const now = this.ctx.currentTime;
    
    const notes = [220, 185, 147, 110]; // minor descending chords
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, startTime);
      
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterBus!);
      gain.connect(this.reverbBus!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  static playGameOver() {
    if (!this.ctx || !this.masterBus) return;
    const now = this.ctx.currentTime;
    
    const pitches = [110, 104, 73]; // heavy dramatic doom chords
    pitches.forEach((freq, idx) => {
      const startTime = now + idx * 0.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
      
      osc.connect(gain);
      gain.connect(this.masterBus!);
      
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  static playVictory() {
    if (!this.ctx || !this.masterBus || !this.reverbBus) return;
    const now = this.ctx.currentTime;
    
    const chord = [220, 277, 330, 440, 554, 660];
    chord.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
      
      osc.connect(gain);
      gain.connect(this.masterBus!);
      gain.connect(this.reverbBus!);
      
      osc.start(startTime);
      osc.stop(startTime + 1.0);
    });
  }
}
