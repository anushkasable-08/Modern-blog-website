// AI Pulse - Feature Module
// Handles interactive features for AI news and insights website

class AIFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.setupNewsFiltering();
    this.setupSmoothScroll();
    this.setupNewsletterValidation();
    this.setupReadingTimeEstimate();
    this.setupSearchFunctionality();
    this.setupThemeToggle();
    this.setupBookmarks();
    this.setupAnalytics();
  }

  // Feature 1: Smooth Scrolling Navigation
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  // Feature 2: Newsletter Email Validation
  setupNewsletterValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (this.validateEmail(email)) {
          this.showNotification('Successfully subscribed! Check your email.', 'success');
          emailInput.value = '';
        } else {
          this.showNotification('Please enter a valid email address.', 'error');
        }
      });
    }
  }

  // Feature 3: Reading Time Estimate
  setupReadingTimeEstimate() {
    document.querySelectorAll('.news-card').forEach((card) => {
      const text = card.innerText;
      const wordsPerMinute = 200;
      const wordCount = text.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / wordsPerMinute);
      
      const timeElement = document.createElement('span');
      timeElement.className = 'reading-time';
      timeElement.textContent = `${readingTime} min read`;
      
      const cardTop = card.querySelector('.card-top');
      if (cardTop) {
        cardTop.appendChild(timeElement);
      }
    });
  }

  // Feature 4: Search Functionality
  setupSearchFunctionality() {
    const searchBar = this.createSearchBar();
    document.body.insertBefore(searchBar, document.querySelector('main'));
    
    const searchInput = document.querySelector('.ai-search-input');
    const searchResults = document.querySelector('.ai-search-results');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 2) {
        this.filterArticles(query, searchResults);
      } else {
        searchResults.innerHTML = '';
      }
    });
  }

  // Feature 5: Theme Toggle (Dark/Light Mode)
  setupThemeToggle() {
    const themeToggle = this.createThemeToggle();
    document.querySelector('.header-inner').appendChild(themeToggle);

    const toggle = document.querySelector('.theme-toggle');
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem(
        'theme',
        document.body.classList.contains('light-mode') ? 'light' : 'dark'
      );
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }

  // Feature 6: Bookmark Articles
  setupBookmarks() {
    document.querySelectorAll('.news-card').forEach((card) => {
      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = 'bookmark-btn';
      bookmarkBtn.innerHTML = '★';
      bookmarkBtn.title = 'Bookmark this article';

      bookmarkBtn.addEventListener('click', () => {
        card.classList.toggle('bookmarked');
        bookmarkBtn.classList.toggle('active');
        this.saveBookmark(card.innerText);
      });

      const cardTop = card.querySelector('.card-top');
      if (cardTop) {
        cardTop.appendChild(bookmarkBtn);
      }
    });
  }

  // Feature 7: Analytics Tracking
  setupAnalytics() {
    document.querySelectorAll('.card-link, .read-more, .btn').forEach((link) => {
      link.addEventListener('click', () => {
        this.trackEvent('link_click', {
          text: link.innerText,
          url: link.href,
          timestamp: new Date().toISOString(),
        });
      });
    });

    window.addEventListener('scroll', () => {
      const scrollPercentage = (
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) *
        100
      ).toFixed(2);
      if (scrollPercentage % 25 === 0) {
        this.trackEvent('page_scroll', { percentage: scrollPercentage });
      }
    });
  }

  // Helper: Email Validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper: Show Notifications
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ai-notification ai-notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Helper: Filter Articles by Search Query
  filterArticles(query, resultsContainer) {
    const articles = document.querySelectorAll('.news-card');
    const matches = [];

    articles.forEach((article) => {
      const title = article.querySelector('h3').textContent.toLowerCase();
      const description = article.querySelector('p').textContent.toLowerCase();

      if (title.includes(query) || description.includes(query)) {
        matches.push(article.cloneNode(true));
      }
    });

    if (matches.length > 0) {
      resultsContainer.innerHTML = '';
      matches.forEach((match) => {
        resultsContainer.appendChild(match);
      });
    } else {
      resultsContainer.innerHTML = '<p class="no-results">No articles found.</p>';
    }
  }

  // Helper: Save Bookmarks to LocalStorage
  saveBookmark(articleTitle) {
    let bookmarks = JSON.parse(localStorage.getItem('ai_bookmarks')) || [];
    const index = bookmarks.indexOf(articleTitle);

    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(articleTitle);
    }

    localStorage.setItem('ai_bookmarks', JSON.stringify(bookmarks));
  }

  // Helper: Track Analytics Event
  trackEvent(eventName, eventData) {
    const event = {
      event: eventName,
      data: eventData,
      userAgent: navigator.userAgent,
    };
    console.log('Analytics Event:', event);

    const events = JSON.parse(localStorage.getItem('ai_events')) || [];
    events.push(event);
    localStorage.setItem('ai_events', JSON.stringify(events));
  }

  // Helper: Create Search Bar Element
  createSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'ai-search-container';
    searchContainer.innerHTML = `
      <div class="container">
        <input 
          type="text" 
          class="ai-search-input" 
          placeholder="Search articles..." 
          aria-label="Search articles"
        />
        <div class="ai-search-results"></div>
      </div>
    `;
    return searchContainer;
  }

  // Helper: Create Theme Toggle Button
  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '☀️';
    toggle.title = 'Toggle dark/light mode';
    toggle.type = 'button';
    return toggle;
  }

  // Feature 8: Get Popular Articles
  getPopularArticles() {
    const events = JSON.parse(localStorage.getItem('ai_events')) || [];
    const clicks = {};

    events.forEach((event) => {
      if (event.event === 'link_click') {
        const text = event.data.text;
        clicks[text] = (clicks[text] || 0) + 1;
      }
    });

    return Object.entries(clicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }

  // Feature 9: Get Reading Statistics
  getReadingStats() {
    const events = JSON.parse(localStorage.getItem('ai_events')) || [];
    const stats = {
      totalClicks: events.filter((e) => e.event === 'link_click').length,
      avgScrollDepth:
        events.filter((e) => e.event === 'page_scroll').length > 0
          ? (
              events
                .filter((e) => e.event === 'page_scroll')
                .reduce((sum, e) => sum + parseFloat(e.data.percentage), 0) /
              events.filter((e) => e.event === 'page_scroll').length
            ).toFixed(2)
          : 0,
      totalBookmarks:
        JSON.parse(localStorage.getItem('ai_bookmarks')) || [],
    };

    return stats;
  }

  // Feature 10: Export Bookmarks
  exportBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('ai_bookmarks')) || [];
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_pulse_bookmarks_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize Features on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new AIFeatures();
});

// Export for Module Systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIFeatures;
}