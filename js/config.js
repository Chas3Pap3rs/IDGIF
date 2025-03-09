// Configuration for handling paths in different environments
const config = {
    // Check if we're in production (idgif.com or GitHub Pages)
    isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // Get the base URL for the current environment
    getBaseUrl: function() {
        if (this.isProduction) {
            // If on GitHub Pages
            if (window.location.hostname.includes('github.io')) {
                return '/IDGIF';
            }
            // If on idgif.com
            return '';
        }
        // Local development
        return '';
    },

    // Get the search page URL
    getSearchPageUrl: function(query = '') {
        const base = this.isProduction ? '/search' : '/pages/search-page.html';
        return `${this.getBaseUrl()}${base}${query ? '?q=' + encodeURIComponent(query) : ''}`;
    }
};
