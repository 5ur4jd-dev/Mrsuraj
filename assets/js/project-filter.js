/**
 * Dynamic Portfolio Filter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#portfolio-cards-container .project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle selected pressed styles
        filterButtons.forEach(b => {
          b.classList.remove('pressed');
          b.setAttribute('aria-pressed', 'false');
        });
        
        btn.classList.add('pressed');
        btn.setAttribute('aria-pressed', 'true');

        const activeFilter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (activeFilter === 'all' || cardCategory === activeFilter) {
            card.style.display = 'flex';
            // Trigger animation frame for fade in
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(0.95)';
            // Hide after transition concludes
            setTimeout(() => {
              const selectedFilter = document.querySelector('.filter-btn[aria-pressed="true"]')?.getAttribute('data-filter');
              if (selectedFilter === activeFilter) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }
});
