/**
 * Skeuomorphic Engine Interactive Physical Response (Optional WebGL bindings)
 */
document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  const engineDisc = document.querySelector('.hero-disc-container');
  const enginePanel = document.querySelector('.hero-engine');

  if (engineDisc && enginePanel) {
    // 1. Precise cursor tracking on the skeuomorphic panel
    enginePanel.addEventListener('mousemove', (e) => {
      const rect = enginePanel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate angular vectors
      const angleX = (y / (rect.height / 2)) * 14; 
      const angleY = (x / (rect.width / 2)) * -14; 
      
      // Rotate the whole dashboard panel slightly using perspective
      enginePanel.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      
      // Shift disk slightly to express deep parallax depth layers
      const discShiftX = (x / (rect.width / 2)) * 15;
      const discShiftY = (y / (rect.height / 2)) * 15;
      engineDisc.style.transform = `translate(-50%, -50%) translate3d(${discShiftX}px, ${discShiftY}px, 20px) rotateX(${-angleX * 0.4}deg) rotateY(${-angleY * 0.4}deg)`;
    });

    enginePanel.addEventListener('mouseleave', () => {
      enginePanel.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      engineDisc.style.transform = 'translate(-50%, -50%) translate3d(0, 0, 0)';
    });

    // 2. Physical dial click events with mechanical rumble feedback
    engineDisc.addEventListener('mousedown', () => {
      engineDisc.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3), inset 6px 6px 12px rgba(0, 0, 0, 0.1)';
    });

    engineDisc.addEventListener('mouseup', () => {
      engineDisc.style.boxShadow = '0px 10px 30px rgba(0, 0, 0, 0.4), inset 4px 4px 10px rgba(255, 255, 255, 0.7)';
    });
  }
});
