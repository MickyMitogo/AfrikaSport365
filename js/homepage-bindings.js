/**
 * AfrikaSport365 - Homepage Data Bindings
 * Fetches /data/homepage.json and binds content to DOM elements
 * using data-cms-field attributes
 */

(function() {
    'use strict';

    /**
     * Get nested property from object using dot notation
     * @param {Object} obj - Source object
     * @param {string} path - Property path (e.g., 'hero.meta.date')
     * @returns {*} Property value or undefined
     */
    function getNestedProperty(obj, path) {
        try {
            return path.split('.').reduce((current, prop) => {
                return current && current[prop] !== undefined ? current[prop] : undefined;
            }, obj);
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Bind data to element based on data-cms-field attribute
     * @param {HTMLElement} element - DOM element to bind
     * @param {Object} data - JSON data source
     */
    function bindElement(element, data) {
        const fieldPath = element.getAttribute('data-cms-field');
        if (!fieldPath) return;

        const value = getNestedProperty(data, fieldPath);
        if (value === undefined || value === null) return;

        // Handle different element types
        const tagName = element.tagName.toLowerCase();

        // Images: update src
        if (tagName === 'img') {
            if (value) element.src = value;
            return;
        }

        // Links: update href
        if (tagName === 'a' && fieldPath.includes('Link')) {
            element.href = value;
            return;
        }

        // Input fields: update value
        if (tagName === 'input' || tagName === 'textarea') {
            element.value = value;
            return;
        }

        // Special handling for AFCON team names (preserve position number)
        if (fieldPath.includes('afconSpotlight.group.teams') && fieldPath.includes('.name')) {
            const position = fieldPath.match(/\.teams\.(\d+)\./)?.[1];
            if (position !== undefined) {
                element.textContent = `${parseInt(position) + 1}. ${value}`;
                return;
            }
        }

        // Default: update text content
        element.textContent = value;
    }

    /**
     * Bind all elements with data-cms-field attributes
     * @param {Object} data - JSON data source
     */
    function bindAllElements(data) {
        const elements = document.querySelectorAll('[data-cms-field]');
        
        elements.forEach(element => {
            try {
                bindElement(element, data);
            } catch (error) {
                // Fail silently
            }
        });
    }

    /**
     * Fetch homepage data
     * @returns {Promise<Object>} Homepage data
     */
    async function fetchHomepageData() {
        try {
            const response = await fetch('/data/config.json', {
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
            // Fail silently - return null
            return null;
        }
    }

    /**
     * Initialize homepage bindings
     */
    async function init() {
        try {
            const data = await fetchHomepageData();
            if (!data) return;
            
            // Bind all elements with data-cms-field
            bindAllElements(data);
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

})();
