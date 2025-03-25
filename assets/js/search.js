// This is an updated version of the search.js file with added functionality for the about page search

document.addEventListener('DOMContentLoaded', function () {
  // Get search elements
  const searchInput = document.getElementById('search-input');
  const aboutSearchInput = document.getElementById('about-search-input');
  const searchResults = document.getElementById('search-results');
  const aboutSearchResults = document.getElementById('about-search-results');
  const header = document.getElementById('site-header');
  const mainContent = document.querySelector('main');
  const footer = document.querySelector('footer');

  let searchData = [];

  // Load the search index with better error handling
  console.log('Attempting to load search index from /index.json');
  fetch('/index.json')
    .then(response => {
      console.log('Search index fetch response:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Search index data received:', data);
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('Search index appears to be empty or invalid');
        throw new Error('Search index is empty or invalid');
      }
      searchData = data;
      console.log('Search index loaded successfully:', searchData.length, 'items');
      
      // If search inputs are focused, perform an initial empty search to show the data is ready
      if (document.activeElement === searchInput && searchInput.value) {
        performSearch(searchInput.value, searchResults);
      }
      if (document.activeElement === aboutSearchInput && aboutSearchInput.value) {
        performSearch(aboutSearchInput.value, aboutSearchResults);
      }
    })
    .catch(err => {
      console.error('Error loading search index:', err);
      // Display error in search results for visibility with more specific message
      const errorMessage = `<div class="no-results">
        Search functionality is currently unavailable: ${err.message}.<br>
        Please check console for details.
      </div>`;
      if (searchResults) {
        searchResults.innerHTML = errorMessage;
        searchResults.classList.add('active');
      }
      if (aboutSearchResults) {
        aboutSearchResults.innerHTML = errorMessage;
        aboutSearchResults.classList.add('active');
      }
    });

  // Simple search function with added debugging
  function performSearch(query, resultsContainer) {
    console.log('Performing search for:', query);
    
    // Clear results if query is empty
    if (query.trim() === '') {
      resultsContainer.innerHTML = '';
      resultsContainer.classList.remove('active');
      return;
    }

    // Check if search data is loaded
    if (!searchData || searchData.length === 0) {
      console.warn('Search data not loaded yet or empty');
      resultsContainer.innerHTML = '<div class="no-results">Search index is still loading or not available.</div>';
      resultsContainer.classList.add('active');
      return;
    }

    query = query.toLowerCase();

    // Filter and rank results
    const results = searchData
      .filter(item => {
        // Check if query appears in title, summary, content, categories or tags
        return (
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          (item.content && item.content.toLowerCase().includes(query)) ||
          (item.categories && item.categories.toLowerCase().includes(query)) ||
          (Array.isArray(item.tags) && item.tags.some(tag =>
            tag.toLowerCase().includes(query)
          ))
        );
      })
      .map(item => {
        // Calculate a simple relevance score
        let score = 0;

        // Title matches are most relevant
        if (item.title.toLowerCase().includes(query)) {
          score += 10;
          // Bonus for title starting with query
          if (item.title.toLowerCase().startsWith(query)) {
            score += 5;
          }
        }

        // Category/tag matches are also valuable
        if (item.categories && item.categories.toLowerCase().includes(query)) {
          score += 7;
        }

        if (Array.isArray(item.tags) && item.tags.some(tag =>
          tag.toLowerCase().includes(query)
        )) {
          score += 6;
        }

        // Summary matches
        if (item.summary.toLowerCase().includes(query)) {
          score += 4;
        }

        // Content matches
        if (item.content && item.content.toLowerCase().includes(query)) {
          score += 2;
        }

        return { item, score };
      })
      .sort((a, b) => b.score - a.score); // Sort by score (descending)

    console.log(`Found ${results.length} results for query: "${query}"`);

    // Clear previous results
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found for "' + query + '"</div>';
      resultsContainer.classList.add('active');
      return;
    }

    // Display results (limited to top 10)
    results.slice(0, 10).forEach(result => {
      const item = result.item;
      const resultElement = document.createElement('a');
      resultElement.href = item.permalink;
      resultElement.className = 'search-result-item';

      // Highlight the query in the title and summary
      let title = item.title;
      let summary = item.summary;

      // Simple highlighting with conditional checks
      if (title.toLowerCase().includes(query)) {
        const regex = new RegExp(query, 'gi');
        title = title.replace(regex, match => `<mark>${match}</mark>`);
      }

      if (summary.toLowerCase().includes(query)) {
        const regex = new RegExp(query, 'gi');
        summary = summary.replace(regex, match => `<mark>${match}</mark>`);
      }

      resultElement.innerHTML = `
          <div class="search-result-category ${item.section}">${item.section}</div>
          <div class="search-result-title">${title}</div>
          <div class="search-result-summary">${summary.substring(0, 120)}${summary.length > 120 ? '...' : ''}</div>
          <div class="search-result-date">${item.date}</div>
        `;

      resultsContainer.appendChild(resultElement);
    });

    resultsContainer.classList.add('active');
  }

  // Handle about page search input
  let aboutDebounceTimeout;
  if (aboutSearchInput) {
    aboutSearchInput.addEventListener('input', function () {
      clearTimeout(aboutDebounceTimeout);
      aboutDebounceTimeout = setTimeout(() => {
        performSearch(this.value, aboutSearchResults);
      }, 300); // Debounce for better performance
    });

    // Close about search results when clicking outside
    document.addEventListener('click', function (e) {
      if (!aboutSearchInput.contains(e.target) && !aboutSearchResults.contains(e.target)) {
        aboutSearchResults.classList.remove('active');
      }
    });
  }

  // Handle main header search input
  let debounceTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        performSearch(this.value, searchResults);
      }, 300); // Debounce for better performance
    });
  }

  // Close search results when clicking outside
  document.addEventListener('click', function (e) {
    if (searchInput && !searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
      if (searchResults) searchResults.classList.remove('active');
    }
  });

  // Clear results when search is closed
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (searchResults) searchResults.classList.remove('active');
      if (aboutSearchResults) aboutSearchResults.classList.remove('active');
    }
  });
  
  // Special handling for about page search focusing
  // This allows users to click on the about page search without expanding the header search
  if (aboutSearchInput) {
    aboutSearchInput.addEventListener('focus', function (e) {
      // Prevent event from propagating to avoid triggering the header expansion
      e.stopPropagation();
    });
  }
});