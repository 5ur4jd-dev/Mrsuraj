/**
 * Accessible FAQ Accordion Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other panels (Optional: allows multiple if turned off)
        closeAllAccordions(accordionItems);

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.hidden = false;
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  function closeAllAccordions(items) {
    items.forEach(item => {
      item.classList.remove('active');
      const trigger = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (content) {
        content.style.maxHeight = '0px';
        content.hidden = true;
      }
    });
  }
});
