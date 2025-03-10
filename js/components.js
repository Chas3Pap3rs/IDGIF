// Load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Setup navbar toggle icon change after component is loaded
        setupNavbarToggle();

        // If this is the navbar, initialize search functionality
        if (componentPath.includes('navbar.html')) {
            const searchForm = document.getElementById('search-form');
            const searchInput = document.getElementById('search-input');
            const randomButton = document.getElementById('random');

            // Event listener for search form submission
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const q = searchInput.value;

                if (q.trim() === '') {
                    alert('Please enter what you want to search');
                    return;
                }

                // Check if we're already on the search page
                if (window.location.pathname.includes('search-page.html') || window.location.pathname.endsWith('/search')) {
                    // If on search page, perform the search directly
                    search(q, 'results');
                } else {
                    // If not on search page, redirect to it
                    window.location.href = config.getSearchPageUrl(q);
                }
            });

            // Function to get a random word and perform search
            async function getRandomWordAndSearch() {
                try {
                    const response = await fetch('https://random-word-api.vercel.app/api?words=1');
                    const [randomWord] = await response.json();
                    
                    // Update the URL with the random word
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('q', randomWord);
                    window.history.pushState({}, '', newUrl);
                    
                    // Update the search input with the random word
                    searchInput.value = randomWord;
                    
                    // Set random state to used
                    localStorage.setItem('randomState', 'used');
                    
                    // Perform the search
                    search(randomWord, 'results');
                } catch (error) {
                    console.error('Error fetching random word:', error);
                    // Fallback to 'random' if API fails
                    search('random', 'results');
                }
            }

            // Event listener for random button click
            randomButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the current random state
                const randomState = localStorage.getItem('randomState') || 'initial';
                console.log('Current random state:', randomState);

                // Check if we're already on the search page
                if (window.location.pathname.includes('search-page.html') || window.location.pathname.endsWith('/search')) {
                    if (randomState === 'initial' && searchQuery !== 'random') {
                        // First time using random: search for 'random'
                        console.log('First random search, searching "random"');
                        search('random', 'results');
                        localStorage.setItem('randomState', 'searching');
                    } else {
                        // Subsequent clicks or continuing from home page: use random word API
                        console.log('Using random word API');
                        getRandomWordAndSearch();
                    }
                } else {
                    // If not on search page, redirect to it with 'random'
                    if (randomState === 'initial') {
                        localStorage.setItem('randomState', 'searching');
                    }
                    window.location.href = config.getSearchPageUrl('random');
                }
            });
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function setupNavbarToggle() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const toggleIcon = document.querySelector('.navbar-toggler i');
    
    navbarCollapse.addEventListener('show.bs.collapse', function () {
        setTimeout(() => {
            toggleIcon.className = 'fa-solid fa-caret-up';
        }, 300);
    });
    
    navbarCollapse.addEventListener('hide.bs.collapse', function () {
        toggleIcon.className = 'fa-solid fa-caret-down';
    });
}
