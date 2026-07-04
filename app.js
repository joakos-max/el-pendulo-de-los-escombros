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

    // 4. Interactive Broken Flag Rumble (CSS Animation only)
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
        };

        brokenFlag.addEventListener('click', triggerRumble);
        brokenFlag.addEventListener('touchend', triggerRumble);
    }
});
