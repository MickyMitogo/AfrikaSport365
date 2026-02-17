/**
 * Dynamic Header & Footer Loader
 * This script loads the header and footer HTML from includes/ directory
 * into all pages for consistent navigation and footer across the site
 */

async function loadComponent(selector, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        const html = await response.text();
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
            // Re-initialize mobile menu scripts after header is loaded
            if (selector === '#app-header') {
                initializeMobileMenu();
            }
        }
    } catch (error) {
        console.error(`Error loading component from ${filePath}:`, error);
    }
}

function initializeMobileMenu() {
    // Toggle Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const svg = mobileMenuBtn.querySelector('svg');
            if (svg) svg.classList.toggle('rotate-180');
        });

        // Mobile Dropdown Toggles
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdownId = btn.getAttribute('data-dropdown') + '-dropdown';
                const dropdown = document.getElementById(dropdownId);
                const svg = btn.querySelector('svg');

                // Close other dropdowns
                dropdownBtns.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        const otherId = otherBtn.getAttribute('data-dropdown') + '-dropdown';
                        const otherDropdown = document.getElementById(otherId);
                        const otherSvg = otherBtn.querySelector('svg');
                        if (otherDropdown) otherDropdown.classList.add('hidden');
                        if (otherSvg) otherSvg.classList.remove('rotate-180');
                    }
                });

                // Toggle current dropdown
                if (dropdown) dropdown.classList.toggle('hidden');
                if (svg) svg.classList.toggle('rotate-180');
            });
        });

        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.parentElement.classList.contains('mobile-dropdown')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuBtn.querySelector('svg')) {
                        mobileMenuBtn.querySelector('svg').classList.remove('rotate-180');
                    }
                }
            });
        });
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Get the base path (for pages in subdirectories)
    const currentPath = window.location.pathname;
    const isRoot = currentPath.split('/').slice(-1)[0] === 'index.html' ||
        currentPath.endsWith('/') ||
        !currentPath.includes('.');

    const basePath = isRoot ? '' : '../';

    // Load header
    if (document.getElementById('app-header')) {
        await loadComponent('#app-header', `${basePath}includes/header.html`);
    }

    // Load footer
    if (document.getElementById('app-footer')) {
        await loadComponent('#app-footer', `${basePath}includes/footer.html`);
    }
});
