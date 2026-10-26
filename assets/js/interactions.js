/**
 * Micro-interactions and Tactile Parallax
 */
document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll Reveal IntersectionObserver
  if (!isReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal-element');
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Falls back immediately if motion is reduced
    document.querySelectorAll('.reveal-element').forEach(el => el.classList.add('revealed'));
  }

  // 2. Magnetic CTA Buttons
  if (!isReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const btn = e.target.closest('.btn-magnetic');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    document.addEventListener('mouseleave', (e) => {
      const btn = e.target.closest('.btn-magnetic');
      if (btn) {
        btn.style.transform = '';
      }
    }, true);
  }

  // 3. Tactile 3D Tilt on Hero Graphic, Cards and Hexagons
  if (!isReducedMotion) {
    const tiltContainers = document.querySelectorAll('.tilt-target');
    
    tiltContainers.forEach(container => {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const tiltX = ((y / rect.height) - 0.5) * 12; // tilt angle range
        const tiltY = ((x / rect.width) - 0.5) * -12;
        
        container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
      
      container.addEventListener('mouseleave', () => {
        container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
  
  // 4. Physical button press state enhancement
  document.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('.btn-physical');
    if (btn) {
      btn.classList.add('pressed');
    }
  });

  ['mouseup', 'mouseleave'].forEach(eventName => {
    document.addEventListener(eventName, (e) => {
      const btn = e.target.closest('.btn-physical');
      if (btn) {
        btn.classList.remove('pressed');
      }
    }, eventName === 'mouseleave');
  });
});
