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
            
            // Create API toggle with Shadow DOM
            const toggleContainer = document.getElementById('api-toggle-container');
            if (toggleContainer) {
                const currentAPI = localStorage.getItem('preferredAPI') || 'GIPHY';
                const toggle = document.createElement('div');
                const shadow = toggle.attachShadow({mode: 'open'});
                
                // Add isolated styles
                shadow.innerHTML = `
                    <style>
                        .api-toggle {
                            display: flex;
                            align-items: center;
                            height: 38px; /* Match search input height */
                            margin-top: 2px; /* Nudge down slightly */
                        }
                        .switch {
                            position: relative;
                            display: inline-block;
                            width: 60px;
                            height: 34px;
                            margin: 2px;
                        }
                        .switch input {
                            opacity: 0;
                            width: 0;
                            height: 0;
                        }
                        .slider {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: #f7d4c2;
                            border: 2px solid #e9814a;
                            transition: .4s;
                            border-radius: 34px;
                        }
                        .slider:before {
                            position: absolute;
                            content: "G";
                            height: 26px;
                            width: 26px;
                            left: 2px;
                            bottom: 2px;
                            background-color: #e9814a;
                            transition: .4s;
                            border-radius: 50%;
                            color: #f7d4c2;
                            font-family: "Madimi One", sans-serif;
                            font-size: 0.9rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        input:checked + .slider:before {
                            content: "T";
                            transform: translateX(26px);
                        }
                    </style>
                    <div class="api-toggle">
                        <label class="switch">
                            <input type="checkbox" ${currentAPI === 'TENOR' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                `;
                
                // Add event listener
                const input = shadow.querySelector('input');
                input.addEventListener('change', () => {
                    const newAPI = input.checked ? 'TENOR' : 'GIPHY';
                    localStorage.setItem('preferredAPI', newAPI);
                    
                    // Update search input placeholder
                    if (searchInput) {
                        searchInput.placeholder = `Search ${newAPI}...`;
                    }
                    
                    // Let idgif.js handle the API state update
                    switchAPI(newAPI);
                });
                
                toggleContainer.appendChild(toggle);
            }
            
            // Set initial search placeholder based on current API
            if (searchInput) {
                searchInput.placeholder = `Search ${currentAPI}...`;
            }

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
                    // Update URL with new search term
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('q', q);
                    window.history.pushState({}, '', newUrl);
                    
                    // Perform the search directly
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
