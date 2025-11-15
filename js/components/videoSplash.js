// ============================================
// LOADING SPLASH SCREEN MANAGER
// ============================================

export class VideoSplashManager {
    constructor() {
        this.loadingSplash = document.getElementById('loadingSplash');
        this.mainContent = document.getElementById('mainContent');
        
        this.init();
    }

    init() {
        // Check if splash elements exist
        if (!this.loadingSplash) {
            // Show main content immediately
            if (this.mainContent) {
                this.mainContent.classList.add('visible');
            }
            return;
        }

        if (!this.mainContent) {
            return;
        }

        // Prevent scrolling while splash is showing
        document.body.style.overflow = 'hidden';
        
        // Hide splash after 2 seconds
        setTimeout(() => {
            this.hideSplash();
        }, 2000);
    }

    hideSplash() {
        // Start both animations simultaneously for smooth transition
        // Hide splash and show content at the same time
        this.loadingSplash.classList.add('hidden');
        this.mainContent.classList.add('visible');
        
        // Re-enable scrolling after a short delay to allow transition
        setTimeout(() => {
            document.body.style.overflow = '';
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
        }, 100);

        // Remove splash from DOM after transition completes
        setTimeout(() => {
            if (this.loadingSplash && this.loadingSplash.parentNode) {
                this.loadingSplash.remove();
            }
        }, 1000);
    }
}

