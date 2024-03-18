// Get references to DOM elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomButton = document.getElementById("random");

// Get search query from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');

// Function to perform initial search if a query is present in the URL
function initSearch() {
  if (searchQuery) {
    search(searchQuery, 'results'); // Call the search function with the query
  }
}

// Event listener for search form submission
searchForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent default form submission
  const q = searchInput.value;

  if (q.trim() === '') {
    alert('Please enter what you want to search');
  } else {
    const searchPage = 'search-page.html?q=' + encodeURIComponent(q);
    window.location.href = searchPage; // Redirect to search page with encoded query
  }
});

// Event listener for random button click
randomButton.addEventListener('click', function(e) {
  e.preventDefault();
  const searchQuery = 'random'; // Set search query to 'random' for a random search
  const searchPage = 'search-page.html?q=' + encodeURIComponent(searchQuery);
  window.location.href = searchPage; // Redirect to search page
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

// Function to perform a search using the Giphy API
function search(q, target = 'results') {
  const apikey = 'b6Ovqn1dLBbx488ZoH6TvsQckxHYvn1r';
  const path = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}`;
  const resultsElem = document.getElementById(target);

  fetch(path)
    .then(res => res.json())
    .then(json => {
      let resultsHTML = '';
      json.data.forEach(obj => {
        const url = obj.images.fixed_width.url;
        const width = obj.images.fixed_width.width;
        const height = obj.images.fixed_width.height;
        const title = obj.title;
        resultsHTML += `<img
              class="item"
              src="${url}"
              width="${width}"
              height="${height}"
              alt="${title}">`;
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
      console.log(err.message);
    });
}

