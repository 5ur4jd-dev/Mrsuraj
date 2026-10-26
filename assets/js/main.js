/**
 * Core application initializer.
 * Handles page-ready state, native lazy loading, and image skeleton states.
 */
document.addEventListener('DOMContentLoaded', () => {
  const initTheme = () => {
    const storageKey = 'suraj-theme';
    const toggle = document.querySelector('#theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem(storageKey);

    const setTheme = theme => {
      document.documentElement.dataset.theme = theme;

      if (toggle) {
        const isDark = theme === 'dark';
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      }
    };

    setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

    if (!toggle || toggle.dataset.themeBound === 'true') return;

    toggle.dataset.themeBound = 'true';
    toggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, nextTheme);
      setTheme(nextTheme);
    });
  };

  initTheme();

  requestAnimationFrame(() => {
    document.body.classList.add('system-fully-loaded');
  });

  const prepareImage = img => {
    if (!img || img.dataset.loadingPrepared === 'true') return;

    img.dataset.loadingPrepared = 'true';
    img.decoding = 'async';

    const isPriorityImage = img.closest('.hero-section, .page-header') !== null;
    if (!img.hasAttribute('loading')) {
      img.loading = isPriorityImage ? 'eager' : 'lazy';
    }

    const shell = img.closest('.project-thumbnail-wrapper, .image-loading-shell');
    if (shell) {
      shell.classList.add('is-loading');
    }

    const clearLoading = () => {
      shell?.classList.remove('is-loading');
      shell?.classList.add('is-loaded');
    };

    const markError = () => {
      shell?.classList.remove('is-loading');
      shell?.classList.add('is-error');
    };

    img.addEventListener('load', clearLoading, { once: true });
    img.addEventListener('error', markError, { once: true });

    if (img.complete && img.naturalWidth > 0) {
      clearLoading();
    }
  };

  const bindImages = root => {
    if (root.matches?.('img')) {
      prepareImage(root);
    }

    root.querySelectorAll?.('img').forEach(prepareImage);
  };

  bindImages(document);

  const lazyRenderObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element) {
          bindImages(node);
        }
      });
    });
  });

  lazyRenderObserver.observe(document.body, { childList: true, subtree: true });

  const initPianoAmbience = () => {
    const control = document.querySelector('#concentric-disk');
    if (!control) return;

    control.setAttribute('role', 'button');
    control.setAttribute('tabindex', '0');
    control.setAttribute('aria-pressed', 'false');
    control.setAttribute('aria-label', 'Play romantic soft piano');
    control.title = 'Play romantic soft piano';

    let audioContext;
    let masterGain;
    let delayNode;
    let feedbackGain;
    let filterNode;
    let compressorNode;
    let phraseTimer;
    let isPlaying = false;
    const activeOscillators = new Set();

    const progression = [
      [146.83, 220.00, 293.66, 349.23],
      [116.54, 174.61, 233.08, 293.66],
      [174.61, 261.63, 349.23, 440.00],
      [130.81, 196.00, 261.63, 329.63],
    ];

    const melody = [
      [440.00, 0.00, 0.55], [392.00, 0.50, 0.35], [349.23, 0.85, 0.55], [293.66, 1.35, 0.75],
      [349.23, 2.00, 0.45], [392.00, 2.40, 0.45], [440.00, 2.80, 0.80],
      [466.16, 4.00, 0.55], [440.00, 4.50, 0.35], [392.00, 4.85, 0.55], [349.23, 5.35, 0.75],
      [392.00, 6.00, 0.45], [349.23, 6.42, 0.45], [293.66, 6.84, 0.85],
      [523.25, 8.00, 0.55], [493.88, 8.50, 0.35], [440.00, 8.85, 0.55], [392.00, 9.35, 0.75],
      [440.00, 10.00, 0.45], [392.00, 10.42, 0.45], [349.23, 10.84, 0.80],
      [392.00, 12.00, 0.50], [349.23, 12.45, 0.45], [329.63, 12.88, 0.55], [293.66, 13.38, 0.75],
      [261.63, 14.05, 0.55], [293.66, 14.55, 0.45], [349.23, 15.00, 0.90],
    ];

    const ensureAudio = () => {
      if (audioContext) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      masterGain = audioContext.createGain();
      delayNode = audioContext.createDelay(3);
      feedbackGain = audioContext.createGain();
      filterNode = audioContext.createBiquadFilter();
      compressorNode = audioContext.createDynamicsCompressor();

      masterGain.gain.value = 0;
      delayNode.delayTime.value = 0.34;
      feedbackGain.gain.value = 0.16;
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 4200;
      compressorNode.threshold.value = -18;
      compressorNode.knee.value = 18;
      compressorNode.ratio.value = 3;
      compressorNode.attack.value = 0.01;
      compressorNode.release.value = 0.22;

      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      masterGain.connect(compressorNode);
      compressorNode.connect(filterNode);
      filterNode.connect(audioContext.destination);
      masterGain.connect(delayNode);
      delayNode.connect(filterNode);
    };

    const playPianoNote = (frequency, startTime, duration, velocity = 0.45) => {
      const body = audioContext.createOscillator();
      const warmth = audioContext.createOscillator();
      const bell = audioContext.createOscillator();
      const hammer = audioContext.createOscillator();
      const bodyGain = audioContext.createGain();
      const warmthGain = audioContext.createGain();
      const bellGain = audioContext.createGain();
      const hammerGain = audioContext.createGain();

      body.type = 'triangle';
      warmth.type = 'sine';
      bell.type = 'sine';
      hammer.type = 'square';

      body.frequency.setValueAtTime(frequency, startTime);
      warmth.frequency.setValueAtTime(frequency * 0.5, startTime);
      bell.frequency.setValueAtTime(frequency * 2.01, startTime);
      hammer.frequency.setValueAtTime(frequency * 3.01, startTime);

      body.frequency.exponentialRampToValueAtTime(frequency * 0.998, startTime + duration);
      bell.frequency.exponentialRampToValueAtTime(frequency * 2.0, startTime + duration * 0.45);

      bodyGain.gain.setValueAtTime(0.0001, startTime);
      bodyGain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.012);
      bodyGain.gain.exponentialRampToValueAtTime(velocity * 0.22, startTime + 0.28);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      warmthGain.gain.setValueAtTime(0.0001, startTime);
      warmthGain.gain.exponentialRampToValueAtTime(velocity * 0.22, startTime + 0.018);
      warmthGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.9);

      bellGain.gain.setValueAtTime(0.0001, startTime);
      bellGain.gain.exponentialRampToValueAtTime(velocity * 0.18, startTime + 0.01);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.42);

      hammerGain.gain.setValueAtTime(0.0001, startTime);
      hammerGain.gain.exponentialRampToValueAtTime(velocity * 0.035, startTime + 0.006);
      hammerGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);

      body.connect(bodyGain);
      warmth.connect(warmthGain);
      bell.connect(bellGain);
      hammer.connect(hammerGain);
      bodyGain.connect(masterGain);
      warmthGain.connect(masterGain);
      bellGain.connect(masterGain);
      hammerGain.connect(masterGain);

      [body, warmth, bell, hammer].forEach(oscillator => {
        activeOscillators.add(oscillator);
        oscillator.addEventListener('ended', () => {
          activeOscillators.delete(oscillator);
        }, { once: true });
      });

      body.start(startTime);
      warmth.start(startTime);
      bell.start(startTime);
      hammer.start(startTime);
      body.stop(startTime + duration + 0.05);
      warmth.stop(startTime + duration + 0.05);
      bell.stop(startTime + duration + 0.05);
      hammer.stop(startTime + 0.08);
    };

    const schedulePhrase = () => {
      const startAt = audioContext.currentTime + 0.06;
      const barLength = 4;

      progression.forEach((chord, barIndex) => {
        const barStart = startAt + barIndex * barLength;
        const arpeggio = [0, 1, 2, 3, 2, 1, 3, 2];

        arpeggio.forEach((noteIndex, stepIndex) => {
          const noteTime = barStart + stepIndex * 0.5;
          const isBass = noteIndex === 0;
          playPianoNote(chord[noteIndex], noteTime, isBass ? 1.25 : 0.9, isBass ? 0.34 : 0.26);
        });
      });

      melody.forEach(([frequency, offset, duration]) => {
        playPianoNote(frequency, startAt + offset, duration, 0.42);
      });
    };

    const start = async () => {
      ensureAudio();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioContext.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.62, audioContext.currentTime + 0.12);

      isPlaying = true;
      control.classList.add('is-playing');
      control.setAttribute('aria-pressed', 'true');
      control.setAttribute('aria-label', 'Pause romantic soft piano');
      control.title = 'Pause romantic soft piano';

      schedulePhrase();
      phraseTimer = window.setInterval(schedulePhrase, 16000);
    };

    const stop = () => {
      isPlaying = false;
      control.classList.remove('is-playing');
      control.setAttribute('aria-pressed', 'false');
      control.setAttribute('aria-label', 'Play romantic soft piano');
      control.title = 'Play romantic soft piano';

      if (phraseTimer) {
        window.clearInterval(phraseTimer);
        phraseTimer = null;
      }

      if (audioContext && masterGain) {
        masterGain.gain.cancelScheduledValues(audioContext.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioContext.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
      }

      window.setTimeout(() => {
        activeOscillators.forEach(oscillator => {
          try {
            oscillator.stop();
          } catch (error) {
            // Oscillator may have already stopped naturally.
          }
        });
        activeOscillators.clear();
      }, 220);
    };

    const toggle = () => {
      if (isPlaying) {
        stop();
      } else {
        start();
      }
    };

    control.addEventListener('click', toggle);
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  };
  initPianoAmbience();
});
