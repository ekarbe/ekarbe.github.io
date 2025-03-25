document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.blog-carousel');
    if (!carousel) return;
    
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = dots.length; // Actual number of unique slides
    let autoScrollInterval;
    let currentIndex = 0;
    
    function updateCarouselLayout() {
      // Reset any existing transform
      container.style.transform = 'translateX(0)';
      
      // Calculate slide width based on container width
      const carouselWidth = carousel.offsetWidth;
      const slideWidth = carouselWidth / 3;
      
      // Apply widths to all slides
      slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
        slide.style.minWidth = `${slideWidth}px`;
      });
      
      // Update current slide position
      goToSlide(currentIndex, false);
    }
    
    function goToSlide(index, resetTimer = true) {
      // Store current index for auto scrolling
      currentIndex = index;
      
      // Remove active class from all slides
      slides.forEach(slide => slide.classList.remove('active'));
      
      // Add active class to current slide and duplicates
      const actualIndex = index + 1; // Skip the first duplicate
      slides[actualIndex].classList.add('active');
      
      // Get the exact position of the target slide
      const slideRect = slides[actualIndex].getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      
      // Calculate the exact position needed to center the slide
      const currentOffset = slideRect.left - carouselRect.left;
      const targetOffset = (carouselRect.width - slideRect.width) / 2;
      const translateX = targetOffset - currentOffset;
      
      // Get the current transform value and adjust it
      const currentTransform = new DOMMatrix(getComputedStyle(container).transform);
      const newPosition = currentTransform.e + translateX;
      
      container.style.transform = `translateX(${newPosition}px)`;
      
      // Update active dot
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      // Reset auto scrolling if needed
      if (resetTimer) {
        resetAutoScroll();
      }
    }
    
    function resetAutoScroll() {
      // Clear existing interval
      clearInterval(autoScrollInterval);
      
      // Set new interval
      autoScrollInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex, false);
      }, 5000);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });
    
    // Handle window resize
    window.addEventListener('resize', updateCarouselLayout);
    
    // Initial layout setup
    updateCarouselLayout();
    
    // Start auto-scrolling
    resetAutoScroll();
  });