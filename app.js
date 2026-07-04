document.addEventListener('DOMContentLoaded', () => {
    // 1. Timeline Navigation
    const timeNodes = document.querySelectorAll('.time-node');
    const slides = document.querySelectorAll('.timeline-slide');

    timeNodes.forEach(node => {
        node.addEventListener('click', () => {
            // Remove active classes
            timeNodes.forEach(n => n.classList.remove('active'));
            slides.forEach(s => s.classList.remove('active'));

            // Add active class to clicked node
            node.classList.add('active');

            // Scroll clicked node into view center (mobile optimization)
            node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

            // Find and show matching slide
            const year = node.getAttribute('data-year');
            const targetSlide = document.getElementById(`slide-${year}`);
            if (targetSlide) {
                targetSlide.classList.add('active');
            }
        });
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Trigger animation only once
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const animElements = document.querySelectorAll('.section-header, .prologue-container, .anesthetic-card, .contrast-box, .manifesto-box, .geopolitics-content, .geopolitics-visual, .conclusion-philosophy, .conclusion-warning-box');
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        animateOnScroll.observe(el);
    });

    // Helper class definition via JS injection for simplicity
    const style = document.createElement('style');
    style.innerHTML = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 3. Balance Scale Interactivity (Tilted Bar)
    const scaleBar = document.querySelector('.scale-bar');
    const leftSide = document.getElementById('side-left');
    const rightSide = document.getElementById('side-right');

    if (scaleBar && leftSide && rightSide) {
        let activeSide = null;

        const tiltLeft = () => {
            scaleBar.style.transform = 'rotate(-8deg)';
            scaleBar.style.backgroundColor = 'var(--accent-yellow)';
        };

        const tiltRight = () => {
            scaleBar.style.transform = 'rotate(8deg)';
            scaleBar.style.backgroundColor = 'var(--accent-red)';
        };

        const resetScale = () => {
            scaleBar.style.transform = 'rotate(0deg)';
            scaleBar.style.backgroundColor = 'var(--text-secondary)';
        };

        // Desktop Hover Listeners
        leftSide.addEventListener('mouseenter', () => {
            if (!activeSide) tiltLeft();
        });
        leftSide.addEventListener('mouseleave', () => {
            if (!activeSide) resetScale();
        });
        rightSide.addEventListener('mouseenter', () => {
            if (!activeSide) tiltRight();
        });
        rightSide.addEventListener('mouseleave', () => {
            if (!activeSide) resetScale();
        });

        // Mobile/Tablet Tap Listeners
        leftSide.addEventListener('click', () => {
            if (activeSide === 'left') {
                activeSide = null;
                resetScale();
            } else {
                activeSide = 'left';
                tiltLeft();
            }
        });

        rightSide.addEventListener('click', () => {
            if (activeSide === 'right') {
                activeSide = null;
                resetScale();
            } else {
                activeSide = 'right';
                tiltRight();
            }
        });
    }

    // 4. Web Audio API: Immersive Cinematic Mournful Pad (Optimized for Mobile)
    let audioCtx = null;
    let gainNode = null;
    let isPlaying = false;
    let oscs = [];

    const audioToggle = document.getElementById('audio-toggle');
    const iconOff = document.querySelector('.audio-icon-off');
    const iconOn = document.querySelector('.audio-icon-on');

    function initAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // 1. Master Lowpass Filter - 850Hz to keep it warm but fully audible on phone speakers
        const masterFilter = audioCtx.createBiquadFilter();
        masterFilter.type = 'lowpass';
        masterFilter.frequency.setValueAtTime(850, audioCtx.currentTime);

        // 2. Master Gain (fades in/out)
        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);

        // Connections
        masterFilter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // 3. Create Chords (D Minor Cinematic Pad - Raised 1 Octave for Mobile Speakers)
        // D3: 146.83Hz (Sine wave - warm central bass)
        // D4: 293.66Hz (Triangle wave - clear fundamental, highly audible)
        // F4: 349.23Hz (Triangle wave - minor third, highly audible)
        // A4: 440.00Hz (Sine wave - perfect fifth, highly audible)
        // C5: 523.25Hz (Sine wave - minor seventh, highly audible)
        
        const voices = [
            { freq: 146.83, type: 'sine', maxGain: 0.18, lfoFreq: 0.05 },
            { freq: 293.66, type: 'triangle', maxGain: 0.20, lfoFreq: 0.08 },
            { freq: 349.23, type: 'triangle', maxGain: 0.15, lfoFreq: 0.03 },
            { freq: 440.00, type: 'sine', maxGain: 0.18, lfoFreq: 0.04 },
            { freq: 523.25, type: 'sine', maxGain: 0.12, lfoFreq: 0.06 }
        ];

        voices.forEach(voice => {
            const osc = audioCtx.createOscillator();
            osc.type = voice.type;
            osc.frequency.setValueAtTime(voice.freq, audioCtx.currentTime);

            // Individual gain node for slow volume breathing
            const vGain = audioCtx.createGain();
            vGain.gain.setValueAtTime(voice.maxGain * 0.5, audioCtx.currentTime);

            osc.connect(vGain);
            vGain.connect(masterFilter);

            osc.start();
            oscs.push(osc);

            // Create LFO to slowly modulate volume (Breathing Pad Effect)
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            
            lfo.frequency.setValueAtTime(voice.lfoFreq, audioCtx.currentTime);
            lfoGain.gain.setValueAtTime(voice.maxGain * 0.4, audioCtx.currentTime);

            lfo.connect(lfoGain);
            lfoGain.connect(vGain.gain);

            lfo.start();
            oscs.push(lfo);
        });

        // 4. Sub-bass seismic rumble (30Hz) - Still active for headphones/desktop
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(30, audioCtx.currentTime);

        const subGain = audioCtx.createGain();
        subGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

        const subFilter = audioCtx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.setValueAtTime(50, audioCtx.currentTime);

        subOsc.connect(subFilter);
        subFilter.connect(subGain);
        subGain.connect(masterFilter);

        subOsc.start();
        oscs.push(subOsc);

        // LFO for sub-bass rumble breathing
        const subLFO = audioCtx.createOscillator();
        const subLFOGain = audioCtx.createGain();
        subLFO.frequency.setValueAtTime(0.07, audioCtx.currentTime);
        subLFOGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

        subLFO.connect(subLFOGain);
        subLFOGain.connect(subGain.gain);

        subLFO.start();
        oscs.push(subLFO);
    }

    if (audioToggle && iconOff && iconOn) {
        let lastTriggerTime = 0;
        const togglePlay = (e) => {
            const now = Date.now();
            if (now - lastTriggerTime < 400) return; // throttle double inputs
            lastTriggerTime = now;

            if (e) {
                e.preventDefault();
            }

            if (!isPlaying) {
                // Initialize audio on first click (Browser security constraint)
                if (!audioCtx) {
                    initAudio();
                }

                // Resume context if suspended
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }

                // Fade in hum slowly with proper Web Audio automation values (Volume raised to 0.22 for mobile)
                gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 1.5);
                
                // Toggle icons
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
                audioToggle.classList.add('accent-orange');
                isPlaying = true;
            } else {
                // Fade out hum slowly with proper Web Audio automation values
                gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
                setTimeout(() => {
                    if (audioCtx && !isPlaying) {
                        audioCtx.suspend();
                    }
                }, 1000);

                // Toggle icons
                iconOff.classList.remove('hidden');
                iconOn.classList.add('hidden');
                audioToggle.classList.remove('accent-orange');
                isPlaying = false;
            }
        };

        audioToggle.addEventListener('click', togglePlay);
        audioToggle.addEventListener('touchend', togglePlay);
    }

    // 5. Interactive Broken Flag Rumble (Optimized for Mobile)
    const brokenFlag = document.querySelector('.broken-flag-container');
    if (brokenFlag) {
        brokenFlag.style.cursor = 'pointer';
        
        const triggerRumble = (e) => {
            if (e) {
                e.preventDefault();
            }
            
            // Trigger CSS rumble animation
            brokenFlag.classList.remove('rumble');
            void brokenFlag.offsetWidth; // Trigger reflow to restart animation
            brokenFlag.classList.add('rumble');

            // Trigger brief audio rumble if context exists
            if (audioCtx) {
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(110, audioCtx.currentTime); // Raised to 110Hz for mobile speakers
                
                // Lowpass filter to muffle
                const lp = audioCtx.createBiquadFilter();
                lp.type = 'lowpass';
                lp.frequency.setValueAtTime(250, audioCtx.currentTime); // Raised to 250Hz for mobile speakers
                
                gain.gain.setValueAtTime(0.4, audioCtx.currentTime); // Raised volume to 0.4
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
                
                osc.connect(lp);
                lp.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.8);
            }
        };

        brokenFlag.addEventListener('click', triggerRumble);
        brokenFlag.addEventListener('touchend', triggerRumble);
    }
});
