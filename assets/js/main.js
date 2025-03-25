// Update current year for copyright
document.addEventListener('DOMContentLoaded', function() {
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    currentYearElements.forEach(element => {
      element.textContent = currentYear;
    });
    
    // Search functionality
    const searchTrigger = document.getElementById('search-trigger');
    
    if (searchTrigger) {
      const header = document.getElementById('site-header');
      const mainContent = document.querySelector('main');
      const footer = document.querySelector('footer');
      const searchInput = document.querySelector('.search-bar input');
      
      // Toggle search expansion
      searchTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle header expansion
        header.classList.toggle('expanded');
        
        // Toggle main content and footer blur
        mainContent.classList.toggle('blur');
        footer.classList.toggle('blur');
        
        // Focus search input when expanded
        if (header.classList.contains('expanded')) {
          // Small delay to ensure the transition is complete
          setTimeout(() => {
            if (searchInput) searchInput.focus();
          }, 300);
        }
      });
      
      // Close search when clicking outside
      document.addEventListener('click', function(e) {
        if (!header) return;
        
        const isSearchClick = searchTrigger.contains(e.target);
        const isSearchAreaClick = header.contains(e.target);
        
        if (header.classList.contains('expanded') && !isSearchClick && !isSearchAreaClick) {
          header.classList.remove('expanded');
          mainContent.classList.remove('blur');
          footer.classList.remove('blur');
        }
      });
      
      // Close search on Escape key
      document.addEventListener('keydown', function(e) {
        if (!header) return;
        
        if (e.key === 'Escape' && header.classList.contains('expanded')) {
          header.classList.remove('expanded');
          mainContent.classList.remove('blur');
          footer.classList.remove('blur');
        }
      });
    }
  });