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

            // Event listener for random button click
            randomButton.addEventListener('click', function(e) {
                e.preventDefault();
                const searchQuery = 'random';

                // Check if we're already on the search page
                if (window.location.pathname.includes('search-page.html') || window.location.pathname.endsWith('/search')) {
                    // If on search page, perform the search directly
                    search(searchQuery, 'results');
                } else {
                    // If not on search page, redirect to it
                    window.location.href = config.getSearchPageUrl(searchQuery);
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
