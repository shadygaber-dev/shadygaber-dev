// ============================================
// MAIN JAVASCRIPT - Portfolio Website
// ============================================

// Import Components
import { VideoSplashManager } from "./components/videoSplash.js";
import { ThemeManager } from "./components/theme.js";
import { ScrollManager } from "./components/scroll.js";
import { NavigationManager } from "./components/navigation.js";
import { AnimationManager } from "./components/animations.js";
import { ParticlesManager } from "./components/particles.js";
import { initLetterAnimation } from "./components/letterAnimation.js";
import { CookieConsent } from "./components/cookieConsent.js";

/**
 * Main Application Class
 * Initializes and manages all components
 */
class App {
  constructor() {
    this.managers = {};
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }
  }

  /**
   * Start the application and initialize all managers
   */
  start() {
    try {
      // Initialize loading splash screen first
      this.managers.loadingSplash = new VideoSplashManager();

      // Initialize all managers
      this.managers.theme = new ThemeManager();
      this.managers.scroll = new ScrollManager();
      this.managers.navigation = new NavigationManager();
      this.managers.animation = new AnimationManager();

      // Initialize particles background for entire site
      this.managers.particles = new ParticlesManager();

      // Initialize cookie consent popup
      this.managers.cookieConsent = new CookieConsent();

      // Initialize letter animation for hero title
      initLetterAnimation();

      // Initialize counter animations on homepage
      if (document.querySelector(".stat-number")) {
        this.initCounters();
      }
    } catch (error) {
      console.error("Error initializing application:", error);
    }
  }

  /**
   * Counter Animation for Stats
   * Animates number counters when they come into view
   */
  initCounters() {
    const counters = document.querySelectorAll(".stat-number");
    if (counters.length === 0) return;

    const speed = 200; // Animation speed

    /**
     * Animate a single counter
     * @param {HTMLElement} counter - The counter element to animate
     */
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute("data-count"), 10) || 0;
      if (target === 0) return;

      const increment = target / speed;
      let count = 0;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.textContent = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + "+";
        }
      };

      updateCount();
    };

    // Intersection Observer for counters
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    counters.forEach((counter) => observer.observe(counter));
  }
}

// Start the application
new App();
