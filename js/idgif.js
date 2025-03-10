// Get search query from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');

// Function to perform initial search if a query is present in the URL
function initSearch() {
  if (searchQuery) {
    search(searchQuery, 'results');
  }
}

// Initialize homepage search functionality
function initializeHomeSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const randomButton = document.getElementById('random');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const q = searchInput.value;

      if (q.trim() === '') {
        alert('Please enter what you want to search');
        return;
      }

      window.location.href = config.getSearchPageUrl(q);
    });
  }

  if (randomButton) {
    randomButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = config.getSearchPageUrl('random');
    });
  }
}

// Call initialization on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeHomeSearch();
  
  // Initialize API toggle
  const apiToggle = document.getElementById('apiToggle');
  if (apiToggle) {
    console.log('Initial API state:', currentAPI);
    
    // Set initial state based on stored preference
    const isTenor = currentAPI === 'TENOR';
    apiToggle.checked = isTenor;
    
    // Remove any existing active classes
    document.querySelectorAll('.api-label').forEach(label => {
      label.classList.remove('active');
    });
    
    // Add active class to current API label
    const activeLabel = document.querySelector(`.api-label:nth-child(${isTenor ? 3 : 1})`);
    if (activeLabel) {
      activeLabel.classList.add('active');
    }
    
    // Update powered by text
    const attribution = document.querySelector('.powered-by');
    if (attribution) {
      attribution.textContent = `Powered by ${currentAPI}`;
    }
    
    // Handle toggle changes
    apiToggle.addEventListener('change', function() {
      switchAPI(this.checked ? 'TENOR' : 'GIPHY');
    });
  }
});

// Function to copy the image URL to the clipboard upon click
function copyImageURL(imageElement) {
  const imageURL = imageElement.src;
  navigator.clipboard.writeText(imageURL)
    .then(() => {
      alert('Image URL copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy image URL: ', err);
      console.warn('Image copying might not be supported in this browser.');
    });

  // Delay hiding the message container to ensure visibility
  setTimeout(() => {
    messageContainer.style.display = 'none';
  }, 1000);
}

// API configuration
const APIs = {
  GIPHY: {
    key: 'b6Ovqn1dLBbx488ZoH6TvsQckxHYvn1r',
    searchUrl: 'https://api.giphy.com/v1/gifs/search',
    parseResponse: (json) => {
      return json.data.map(obj => ({
        url: obj.images.fixed_width.url,
        width: obj.images.fixed_width.width,
        height: obj.images.fixed_width.height,
        title: obj.title
      }));
    }
  },
  TENOR: {
    key: 'AIzaSyBfS4DCuAnnxgN9MfxgEjgKtXES3C_E2iM',
    searchUrl: 'https://tenor.googleapis.com/v2/search',
    parseResponse: (json) => {
      return json.results.map(obj => ({
        url: obj.media_formats.gif.url,
        width: obj.media_formats.gif.dims[0],
        height: obj.media_formats.gif.dims[1],
        title: obj.title
      }));
    }
  }
};

// Get current API preference from localStorage or default to GIPHY
let currentAPI = localStorage.getItem('preferredAPI') || 'GIPHY';

// Function to update API visual states
function updateAPIStates(apiName) {
  console.log('Updating API states for:', apiName);
  // Update API labels
  const labels = document.querySelectorAll('.api-label');
  labels.forEach(label => {
    const isActive = label.textContent.trim().toUpperCase() === apiName.toUpperCase();
    console.log(`Label: "${label.textContent.trim()}", Should be active: ${isActive}`);
    if (isActive) {
      label.classList.add('active');
    } else {
      label.classList.remove('active');
    }
  });

  // Update attribution text
  const attribution = document.querySelector('.powered-by');
  if (attribution) {
    attribution.textContent = `Powered by ${apiName}`;
  }
}

// Function to switch API
function switchAPI(apiName) {
  if (APIs[apiName]) {
    console.log(`Switching API from ${currentAPI} to ${apiName}`);
    currentAPI = apiName;
    localStorage.setItem('preferredAPI', apiName);
    
    // Update visual states
    updateAPIStates(apiName);

    // If we're on the search page and have a query, refresh the search
    const urlParams = new URLSearchParams(window.location.search);
    const currentQuery = urlParams.get('q');
    if (currentQuery && document.getElementById('results')) {
      console.log(`Refreshing search with query: ${currentQuery}`);
      search(currentQuery, 'results');
    }
  }
}

// Function to perform a search using the selected API
function search(q, target = 'results') {
  console.log(`Performing search with ${currentAPI} API, query: ${q}`);
  const api = APIs[currentAPI];
  const params = new URLSearchParams();
  
  if (currentAPI === 'GIPHY') {
    params.set('api_key', api.key);
    params.set('q', q);
    params.set('limit', '50');
  } else if (currentAPI === 'TENOR') {
    params.set('key', api.key);
    params.set('q', q);
    params.set('limit', '50');
    params.set('client_key', 'idgif');
  }

  const path = `${api.searchUrl}?${params.toString()}`;
  const resultsElem = document.getElementById(target);
  
  // Add API-specific class to results container
  resultsElem.className = `results ${currentAPI.toLowerCase()}-results`;

  fetch(path)
    .then(res => res.json())
    .then(json => {
      const gifs = api.parseResponse(json);
      let resultsHTML = '';
      
      gifs.forEach(gif => {
        resultsHTML += `<img
              class="item"
              src="${gif.url}"
              width="${gif.width}"
              height="${gif.height}"
              alt="${gif.title}">`;
      });

      resultsElem.innerHTML = resultsHTML;

      // Add click events to images for copying URLs
      const imageElements = resultsElem.getElementsByTagName('img');
      for (let i = 0; i < imageElements.length; i++) {
        imageElements[i].addEventListener('click', function() {
          copyImageURL(this);
        });
      }
    })
    .catch(err => {
      console.error('Search error:', err.message);
    });
}