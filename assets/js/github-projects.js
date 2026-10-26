/**
 * GitHub project data renderer for the portfolio and home featured cards.
 */
document.addEventListener('DOMContentLoaded', () => {
  const projects = [
    {
      name: 'Sentinel AI',
      url: 'https://github.com/5ur4jd-dev/Sentinel_AI',
      description: 'An autonomous AI sales and development assistant for freelancers, agencies, and small businesses. Automates lead qualification, proposal generation, client communication, follow-ups, and business workflows.',
      category: 'automation',
      overlay: 'AI Sales Assistant',
      tags: ['PHP', 'AI Assistant', 'Automation'],
      meta: 'Updated Aug 06, 2026',
      image: 'assets/Images/sentinel_ai_preview.jpg'
    },
    {
      name: 'Data-light',
      url: 'https://github.com/5ur4jd-dev/Data-light',
      description: 'AI-powered analytics platform for CSV, Excel, and JSON datasets featuring dashboards, automated insights, anomaly detection, charts, filtering, and reporting.',
      category: 'data',
      overlay: 'AI Analytics Platform',
      tags: ['PHP', 'Analytics', 'MIT License'],
      meta: '1 star - Updated Jun 22, 2026',
      image: 'assets/Images/data_light_preview.jpg'
    },
    {
      name: 'PandaChat',
      url: 'https://github.com/5ur4jd-dev/PandaChat',
      description: 'Modern real-time chat platform with Panda-inspired design, group conversations, media sharing, typing indicators, reactions, and responsive UI.',
      category: 'app',
      overlay: 'Realtime Chat Application',
      tags: ['PHP', 'Realtime', 'Websockets'],
      meta: 'Updated Jul 15, 2026',
      image: 'assets/Images/panda_chat_preview.jpg'
    },
    {
      name: 'VeloraMux',
      url: 'https://github.com/5ur4jd-dev/VeloraMux',
      description: 'Professional local video inspection and management tool with metadata viewer, subtitle support, stream analysis, chapter browsing, safe file handling, and export utilities.',
      category: 'app',
      overlay: 'Video Inspection Utility',
      tags: ['Python', 'Video', 'Utility'],
      meta: 'Updated Aug 02, 2026',
      image: 'assets/Images/velora_mux_preview.jpg'
    },
    {
      name: 'Selif',
      url: 'https://github.com/5ur4jd-dev/Selif',
      description: 'Modern Android music streaming application featuring offline playback, playlists, favorites, clean Material UI, and seamless listening experience.',
      category: 'app',
      overlay: 'Android Music Application',
      tags: ['Kotlin', 'Music App', 'Mobile'],
      meta: 'Updated Jun 29, 2026',
      image: 'assets/Images/selif_preview.jpg'
    },
    {
      name: 'Alex',
      url: 'https://github.com/5ur4jd-dev/Alex',
      description: 'Offline desktop voice assistant capable of launching applications, executing local commands, reminders, file operations, automation, and productivity tasks without cloud AI.',
      category: 'automation',
      overlay: 'Offline Voice Assistant',
      tags: ['C++', 'Assistant', 'Automation'],
      meta: '2 stars - Updated Jun 18, 2026',
      image: 'assets/Images/alex_preview.jpg'
    }
  ];

  const filtersContainer = document.querySelector('#portfolio-filters .container');
  const workContainer = document.querySelector('#portfolio-cards-container');
  const homeContainer = document.querySelector('#home-projects .grid-cols-2');

  const renderTags = tags => tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');

  const renderCard = (project, index, headingLevel = 'h2') => `
    <article class="project-card reveal-element revealed" data-category="${project.category}" id="project-card-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
      <div class="project-thumbnail-wrapper is-loading">
        <span class="project-overlay">${project.overlay}</span>
        <img src="${project.image}" alt="${project.name} GitHub project preview" class="project-thumbnail" width="1200" height="630" referrerpolicy="no-referrer" loading="lazy" decoding="async">
      </div>
      <div class="project-body">
        <span class="project-num">GITHUB // ${String(index + 1).padStart(2, '0')}</span>
        <${headingLevel} class="project-title">${project.name}</${headingLevel}>
        <p class="project-desc">${project.description}</p>
        <div class="project-tags">${renderTags(project.tags)}</div>
        <div class="project-card-footer">
          <span class="mono-label project-status">${project.meta}</span>
          <a href="${project.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${project.name} on GitHub" class="btn-physical btn-magnetic">View Repo</a>
        </div>
      </div>
    </article>
  `;

  if (filtersContainer) {
    filtersContainer.innerHTML = `
      <button class="btn-physical filter-btn pressed" data-filter="all" aria-pressed="true">All Work</button>
      <button class="btn-physical filter-btn" data-filter="app" aria-pressed="false">Apps</button>
      <button class="btn-physical filter-btn" data-filter="data" aria-pressed="false">Data Tools</button>
      <button class="btn-physical filter-btn" data-filter="automation" aria-pressed="false">Automation</button>
      <button class="btn-physical filter-btn" data-filter="learning" aria-pressed="false">Labs</button>
      <button class="btn-physical filter-btn" data-filter="profile" aria-pressed="false">Profile</button>
    `;
  }

  if (workContainer) {
    workContainer.innerHTML = projects.map((project, index) => renderCard(project, index, 'h2')).join('');
  }

  if (homeContainer) {
    homeContainer.innerHTML = projects.slice(0, 2).map((project, index) => renderCard(project, index, 'h3')).join('');
  }
});
