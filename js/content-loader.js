/**
 * ============================================================================
 * AFRIKASPORT365 - UNIFIED CONTENT LOADER
 * ============================================================================
 * 
 * PURPOSE:
 * Central module for loading ALL JSON-driven content across the site.
 * This enables future CMS functionality without modifying this file.
 * 
 * ARCHITECTURE:
 * - Single source of truth for data loading
 * - Supports multiple content types (config, articles, AFCON data)
 * - Error handling with graceful fallbacks
 * - Cache support for performance
 * 
 * CMS INTEGRATION READY:
 * To add new content types, simply:
 * 1. Add JSON file to /data/ folder
 * 2. Call loadContent('filename') from page-specific JS
 * 3. No changes needed to this loader
 * 
 * USAGE:
 * import { loadContent } from './content-loader.js';
 * const data = await loadContent('config');
 * ============================================================================
 */

(function(window) {
  'use strict';

  // Configuration
  const CONFIG = {
    dataPath: 'data/',
    cacheEnabled: true,
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    fallbackDelay: 3000 // Show fallback after 3s if loading fails
  };

  // Cache storage
  const cache = new Map();

  /**
   * Load JSON content from data folder
   * @param {string} filename - JSON filename without extension (e.g., 'config', 'articles', 'afcon-data')
   * @param {boolean} forceRefresh - Skip cache and fetch fresh data
   * @returns {Promise<Object>} Parsed JSON data
   */
  async function loadContent(filename, forceRefresh = false) {
    try {
      // Check cache first
      if (CONFIG.cacheEnabled && !forceRefresh) {
        const cached = getCachedData(filename);
        if (cached) {
          console.log(`[ContentLoader] Using cached data for: ${filename}`);
          return cached;
        }
      }

      console.log(`[ContentLoader] Fetching: ${filename}.json`);
      
      const response = await fetch(`${CONFIG.dataPath}${filename}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store in cache
      if (CONFIG.cacheEnabled) {
        setCachedData(filename, data);
      }

      console.log(`[ContentLoader] Successfully loaded: ${filename}`);
      return data;

    } catch (error) {
      console.error(`[ContentLoader] Error loading ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Get cached data if valid
   * @param {string} key - Cache key
   * @returns {Object|null} Cached data or null
   */
  function getCachedData(key) {
    const cached = cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > CONFIG.cacheDuration;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  function setCachedData(key, data) {
    cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear specific cache entry or entire cache
   * @param {string} key - Optional cache key
   */
  function clearCache(key = null) {
    if (key) {
      cache.delete(key);
      console.log(`[ContentLoader] Cleared cache for: ${key}`);
    } else {
      cache.clear();
      console.log(`[ContentLoader] Cleared all cache`);
    }
  }

  /**
   * Load multiple content files in parallel
   * @param {Array<string>} filenames - Array of filenames
   * @returns {Promise<Object>} Object with filename keys and data values
   */
  async function loadMultiple(filenames) {
    try {
      const promises = filenames.map(filename => 
        loadContent(filename).catch(error => {
          console.error(`[ContentLoader] Failed to load ${filename}:`, error);
          return null;
        })
      );

      const results = await Promise.all(promises);
      
      const dataMap = {};
      filenames.forEach((filename, index) => {
        dataMap[filename] = results[index];
      });

      return dataMap;

    } catch (error) {
      console.error('[ContentLoader] Error loading multiple files:', error);
      throw error;
    }
  }

  /**
   * Preload content for better performance
   * @param {Array<string>} filenames - Files to preload
   */
  function preload(filenames) {
    console.log('[ContentLoader] Preloading:', filenames);
    filenames.forEach(filename => {
      loadContent(filename).catch(error => {
        console.warn(`[ContentLoader] Preload failed for ${filename}:`, error);
      });
    });
  }

  // Expose public API
  window.ContentLoader = {
    load: loadContent,
    loadMultiple: loadMultiple,
    preload: preload,
    clearCache: clearCache,
    
    // Utility to check if data file exists
    async exists(filename) {
      try {
        const response = await fetch(`${CONFIG.dataPath}${filename}.json`, { method: 'HEAD' });
        return response.ok;
      } catch {
        return false;
      }
    }
  };

  // Auto-preload common files on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
      // Preload config on all pages
      preload(['config']);
    });
  } else {
    preload(['config']);
=======
      // Preload only required files (config removed)
    });
  } else {
    // Preload only required files (config removed)
>>>>>>> dc026b561452f8a1f5585dcf51fceb27166a4d08
  }

  console.log('[ContentLoader] Module initialized');

})(window);
