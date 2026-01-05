/**
 * AfrikaSport365 - AFCON Spotlight CMS Integration
 * Fetches /data/afcon.json and dynamically renders AFCON content
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        dataPath: '/data/afcon.json',
        selectors: {
            spotlight: '.afcon-spotlight',
            header: '.afcon-header',
            contentGrid: '.afcon-content-grid',
            miniCards: '.afcon-mini-card'
        }
    };

    /**
     * Fetch AFCON data from JSON
     * @returns {Promise<Object|null>} AFCON data or null
     */
    async function fetchAfconData() {
        try {
            const response = await fetch(CONFIG.dataPath, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            // Fail silently
            return null;
        }
    }

    /**
     * Render AFCON header (logo and title)
     * @param {Object} data - AFCON data
     */
    function renderHeader(data) {
        if (!data.tournament) return;

        const header = document.querySelector(CONFIG.selectors.header);
        if (!header) return;

        // Update logo if provided
        const logo = header.querySelector('.afcon-logo img');
        if (logo && data.tournament.logo) {
            logo.src = data.tournament.logo;
            logo.alt = data.tournament.name || 'AFCON 2026';
        }

        // Update title
        const title = header.querySelector('.afcon-title');
        if (title && data.tournament.name) {
            title.textContent = data.tournament.name;
        }

        // Update subtitle
        const subtitle = header.querySelector('.afcon-subtitle');
        if (subtitle && data.tournament.subtitle) {
            subtitle.textContent = data.tournament.subtitle;
        }
    }

    /**
     * Render standings table
     * @param {Array} standings - Array of team standings
     */
    function renderStandings(standings) {
        if (!standings || !Array.isArray(standings) || standings.length === 0) return;

        const cards = document.querySelectorAll(CONFIG.selectors.miniCards);
        const standingsCard = cards[0]; // First card
        if (!standingsCard) return;

        // Find or create standings container
        let container = standingsCard.querySelector('.mini-standings');
        if (!container) {
            container = document.createElement('div');
            container.className = 'mini-standings';
            standingsCard.appendChild(container);
        }

        // Clear existing content
        container.innerHTML = '';

        // Render each team
        standings.forEach((team, index) => {
            const row = document.createElement('div');
            row.className = 'mini-standings-row';

            const position = document.createElement('span');
            position.textContent = `${index + 1}. ${team.name}`;
            
            const points = document.createElement('span');
            points.textContent = `${team.points} ${team.points === 1 ? 'pt' : 'pts'}`;

            row.appendChild(position);
            row.appendChild(points);
            container.appendChild(row);
        });
    }

    /**
     * Render next match information
     * @param {Object} match - Next match data
     */
    function renderNextMatch(match) {
        if (!match) return;

        const cards = document.querySelectorAll(CONFIG.selectors.miniCards);
        const matchCard = cards[1]; // Second card
        if (!matchCard) return;

        // Create match content container
        const content = document.createElement('div');
        content.style.textAlign = 'center';
        content.style.padding = '1rem 0';

        // Match teams
        if (match.teams) {
            const teams = document.createElement('div');
            teams.style.fontSize = '1.125rem';
            teams.style.fontWeight = '700';
            teams.style.marginBottom = '0.5rem';
            teams.textContent = match.teams;
            content.appendChild(teams);
        }

        // Match date
        if (match.date) {
            const date = document.createElement('div');
            date.style.fontSize = '2rem';
            date.style.fontWeight = '900';
            date.style.color = '#fbbf24';
            date.style.margin = '1rem 0';
            date.textContent = match.date;
            content.appendChild(date);
        }

        // Match venue and time
        if (match.venue || match.time) {
            const venueTime = document.createElement('div');
            venueTime.style.fontSize = '0.875rem';
            venueTime.style.opacity = '0.9';
            const parts = [];
            if (match.venue) parts.push(match.venue);
            if (match.time) parts.push(match.time);
            venueTime.textContent = parts.join(' • ');
            content.appendChild(venueTime);
        }

        // Replace card content (keep title)
        const existingContent = matchCard.querySelector('div[style*="text-align"]');
        if (existingContent) {
            existingContent.replaceWith(content);
        } else {
            matchCard.appendChild(content);
        }
    }

    /**
     * Render top scorer information
     * @param {Object} scorer - Top scorer data
     */
    function renderTopScorer(scorer) {
        if (!scorer) return;

        const cards = document.querySelectorAll(CONFIG.selectors.miniCards);
        const scorerCard = cards[2]; // Third card
        if (!scorerCard) return;

        // Create scorer content container
        const content = document.createElement('div');
        content.style.textAlign = 'center';
        content.style.padding = '1rem 0';

        // Icon/Image
        if (scorer.image) {
            const img = document.createElement('img');
            img.src = scorer.image;
            img.alt = scorer.name || 'Top Scorer';
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.borderRadius = '10%';
            img.style.objectFit = 'cover';
            img.style.marginBottom = '0.5rem';
            img.style.display = 'block';
            img.style.marginLeft = 'auto';
            img.style.marginRight = 'auto';
            content.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.style.fontSize = '3rem';
            icon.style.marginBottom = '0.5rem';
            icon.textContent = '⚽';
            content.appendChild(icon);
        }

        // Player name
        if (scorer.name) {
            const name = document.createElement('div');
            name.style.fontSize = '1.25rem';
            name.style.fontWeight = '700';
            name.style.marginBottom = '0.25rem';
            name.textContent = scorer.name;
            content.appendChild(name);
        }

        // Stats
        if (scorer.stats) {
            const stats = document.createElement('div');
            stats.style.fontSize = '0.875rem';
            stats.style.opacity = '0.9';
            stats.textContent = scorer.stats;
            content.appendChild(stats);
        }

        // Replace card content (keep title)
        const existingContent = scorerCard.querySelector('div[style*="text-align"]');
        if (existingContent) {
            existingContent.replaceWith(content);
        } else {
            scorerCard.appendChild(content);
        }
    }

    /**
     * Render complete AFCON spotlight
     * @param {Object} data - AFCON data
     */
    function renderAfconSpotlight(data) {
        if (!data) return;

        // Render each section
        renderHeader(data);
        
        if (data.standings) {
            renderStandings(data.standings);
        }

        if (data.nextMatch) {
            renderNextMatch(data.nextMatch);
        }

        if (data.topScorer) {
            renderTopScorer(data.topScorer);
        }
    }

    /**
     * Initialize AFCON spotlight
     */
    async function init() {
        // Check if spotlight exists on page
        const spotlight = document.querySelector(CONFIG.selectors.spotlight);
        if (!spotlight) return;

        try {
            const data = await fetchAfconData();
            if (!data) return;

            renderAfconSpotlight(data);
        } catch (error) {
            // Fail silently
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for manual refresh if needed
    if (typeof window !== 'undefined') {
        window.AfconSpotlight = {
            refresh: init,
            renderStandings,
            renderNextMatch,
            renderTopScorer
        };
    }

})();
