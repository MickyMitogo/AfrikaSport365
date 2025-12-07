// AFCON 2026 Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Group tabs functionality
  const groupTabs = document.querySelectorAll('.group-tab');
  const groupContents = document.querySelectorAll('.group-content');

  groupTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const groupId = this.getAttribute('data-group');
      
      // Remove active class from all tabs and contents
      groupTabs.forEach(t => t.classList.remove('active'));
      groupContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      const activeContent = document.getElementById(`group-${groupId}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // Auto-refresh live scores (simulated)
  function updateLiveScores() {
    const liveMatches = document.querySelectorAll('.match-status.live');
    liveMatches.forEach(match => {
      // In a real application, this would fetch live data from an API
      console.log('Updating live scores...');
    });
  }

  // Update every 30 seconds
  setInterval(updateLiveScores, 30000);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Video play overlay
  const videoContainers = document.querySelectorAll('.video-play-overlay');
  videoContainers.forEach(container => {
    container.addEventListener('click', function() {
      // In a real application, this would open a video player
      console.log('Playing video...');
      alert('Video player would open here');
    });
  });

  // Poll vote button
  const pollVoteBtn = document.querySelector('.poll-vote-btn');
  if (pollVoteBtn) {
    pollVoteBtn.addEventListener('click', function() {
      // In a real application, this would submit the vote
      alert('¡Gracias por tu voto! Tu predicción ha sido registrada.');
    });
  }

  // Share functionality for live matches
  const shareButtons = document.querySelectorAll('.share-match-btn');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const matchInfo = this.closest('.live-match-card').querySelector('.match-teams').textContent;
      
      if (navigator.share) {
        navigator.share({
          title: 'AFCON 2026 - Resultado en vivo',
          text: matchInfo,
          url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          alert('Enlace copiado al portapapeles');
        });
      }
    });
  });

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.news-card, .story-card, .scorer-card, .city-card, .opinion-card');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      
      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial setup for scroll animation
  const setupScrollAnimation = () => {
    const elements = document.querySelectorAll('.news-card, .story-card, .scorer-card, .city-card, .opinion-card');
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  };

  setupScrollAnimation();
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load

  // Countdown to next match
  function updateCountdown() {
    const nextMatchTime = new Date('2026-01-20T18:00:00').getTime();
    const now = new Date().getTime();
    const distance = nextMatchTime - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      const countdownElement = document.getElementById('match-countdown');
      if (countdownElement) {
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m`;
      }
    }
  }

  // Update countdown every minute
  updateCountdown();
  setInterval(updateCountdown, 60000);

  console.log('AFCON 2026 page initialized');
});
