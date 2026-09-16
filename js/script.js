// Toggle icon navbar (Safely checked)
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// Scroll section active link (Safely checked)
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (id && top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let targetLink = document.querySelector('header nav a[href*=' + id + ']');
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            });
        }
    });

    // Sticky header
    let header = document.querySelector('header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    }

    // Reset mobile menu on scroll
    if (menuIcon && navbar) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }
};

// Universal Fetch and Render Function
async function renderCards(containerId, jsonPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const items = await response.json();

        container.innerHTML = items.map(item => {
            const hasLink = Boolean(item.link && item.link !== '#' && item.link.trim() !== '');

            // Format description: array -> <ul>, string -> <p>
            const descriptionHtml = Array.isArray(item.description)
                ? `<ul class="card-bullets">${item.description.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
                : `<p>${item.description || ''}</p>`;

            // Format tags
            const tagsHtml = item.tags && item.tags.length > 0 
                ? `<div class="experience-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`
                : '';

            const cardContent = `
                <h3>
                    ${item.title || ''} 
                    ${hasLink ? `<i class='bx bx-link-external'></i>` : ''}
                </h3>
                ${descriptionHtml}
                ${tagsHtml}
            `;

            if (hasLink) {
                return `
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="experience-card">
                        ${cardContent}
                    </a>
                `;
            } else {
                return `
                    <div class="experience-card static-card">
                        ${cardContent}
                    </div>
                `;
            }
        }).join('');

    } catch (error) {
        console.error(`Error loading data from ${jsonPath}:`, error);
        container.innerHTML = `<p style="color: red; font-size: 1.4rem;">Failed to load entries.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Relative fetch paths when loaded from inside each subfolder page
    renderCards('projects-container', 'project.json');
    renderCards('work-container', 'work.json');
    renderCards('volunteer-container', 'volunteer.json');
});