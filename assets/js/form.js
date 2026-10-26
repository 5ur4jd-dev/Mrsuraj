/**
 * Tactile Form Submission Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.tactile-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Basic Front-end validation
      let hasError = false;
      const requiredInputs = form.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#c0392b';
          input.style.boxShadow = 'inset 2px 2px 4px rgba(192, 57, 43, 0.15)';
          hasError = true;
          
          input.addEventListener('input', function resetBorder() {
            input.style.borderColor = '';
            input.style.boxShadow = '';
            input.removeEventListener('input', resetBorder);
          });
        }
      });

      if (hasError) {
        showStatus(form, 'Please fill in all required fields.', false);
        return;
      }

      // Check Honeypot
      const honeypot = form.querySelector('.website-honeypot-field');
      if (honeypot && honeypot.value) {
        // Silent block for bots
        return;
      }

      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'LAUNCHING WHATSAPP...';
      submitBtn.classList.add('pressed');

      try {
        // Prepare beautiful, stylized plain text for the WhatsApp chat message
        let textMessage = '';
        
        if (form.id === 'direct-contact-form') {
          const name = form.querySelector('#c_name').value.trim();
          const email = form.querySelector('#c_email').value.trim();
          const phone = form.querySelector('#c_phone').value.trim() || 'Not provided';
          const message = form.querySelector('#c_message').value.trim();
          
          textMessage = `*New Website Inquiry*\n\n` +
            `- *Name:* ${name}\n` +
            `- *Email:* ${email}\n` +
            `- *Phone:* ${phone}\n\n` +
            `*Message:*\n${message}\n\n` +
            `_Submitted via Contact Form_`;
        } else if (form.id === 'start-project-form') {
          const name = form.querySelector('#name').value.trim();
          const email = form.querySelector('#email').value.trim();
          const phone = form.querySelector('#phone').value.trim() || 'Not provided';
          const projectType = form.querySelector('#project_type').value;
          const currentWebsite = form.querySelector('#current_website').value.trim() || 'Not provided';
          const timeline = form.querySelector('#timeline').value;
          const message = form.querySelector('#message').value.trim();
          
          textMessage = `*New Project Proposal*\n\n` +
            `- *Name:* ${name}\n` +
            `- *Email:* ${email}\n` +
            `- *Phone:* ${phone}\n` +
            `- *Project Type:* ${projectType}\n` +
            `- *Current Site:* ${currentWebsite}\n` +
            `- *Requested Timeline:* ${timeline}\n\n` +
            `*Project Details:*\n${message}\n\n` +
            `_Submitted via Project Planner_`;
        } else {
          // Fallback dynamic parser for any other forms
          textMessage = `*New Form Submission*\n\n`;
          const inputs = form.querySelectorAll('input, select, textarea');
          inputs.forEach(input => {
            if (input.name && input.value && input.type !== 'submit' && input.type !== 'hidden') {
              const labelEl = form.querySelector(`label[for="${input.id}"]`);
              const labelText = labelEl ? labelEl.textContent.trim().replace('*', '').trim() : input.name;
              textMessage += `- *${labelText}:* ${input.value}\n`;
            }
          });
        }

        // Encode the message safe for URLs and deep link
        const encodedMsg = encodeURIComponent(textMessage);
        const whatsappNumber = "917219689411";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
        
        showStatus(form, 'Redirecting to WhatsApp with your inquiry details...', true);
        
        window.location.href = whatsappURL;

      } catch (error) {
        console.error('Submission redirect error:', error);
        showStatus(form, 'Encountered issue loading WhatsApp pipeline. Please try direct links.', false);
      } finally {
        // Reset button states slightly after redirection initiates
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.classList.remove('pressed');
        }, 1500);
      }
    });
  });

  function showStatus(form, message, isSuccess) {
    // Clear old status lines first
    const existingStatus = form.querySelector('.form-status');
    if (existingStatus) {
      existingStatus.remove();
    }

    const statusContainer = document.createElement('div');
    statusContainer.className = `form-status clay-card fade-in-up ${isSuccess ? 'success' : 'error'}`;
    statusContainer.style.padding = '12px';
    statusContainer.style.marginTop = '16px';
    statusContainer.style.fontFamily = 'var(--font-mono)';
    statusContainer.style.fontSize = '12px';
    statusContainer.style.textAlign = 'center';
    
    if (isSuccess) {
      statusContainer.style.backgroundColor = 'var(--color-bg-light)';
      statusContainer.style.borderColor = 'var(--color-border)';
      statusContainer.style.color = 'var(--color-text-primary)';
      statusContainer.innerHTML = `STATUS: ${message}`;
    } else {
      statusContainer.style.backgroundColor = 'var(--color-bg-base-alt)';
      statusContainer.style.borderColor = 'var(--color-border)';
      statusContainer.style.color = '#7f1d1d';
      statusContainer.innerHTML = `NOTICE: ${message}`;
    }

    form.appendChild(statusContainer);
    
    // Automatically fade out notification
    setTimeout(() => {
      statusContainer.style.opacity = '0';
      statusContainer.style.transition = 'opacity 0.6s ease';
      setTimeout(() => statusContainer.remove(), 600);
    }, 5000);
  }
});
