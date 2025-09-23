import './styles/main.css';
import { App } from './components/App';

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Application initialization
class AppController {
  private app: App;

  constructor() {
    this.app = new App();
    this.init();
  }

  private init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.mount());
    } else {
      this.mount();
    }

    // Handle PWA install prompt
    this.setupPWAInstallPrompt();
    
    // Setup offline detection
    this.setupOfflineDetection();
  }

  private mount(): void {
    const appContainer = document.getElementById('app');
    if (appContainer) {
      // Clear loading content
      appContainer.innerHTML = '';
      
      // Mount the main app
      this.app.mount(appContainer);
    } else {
      console.error('App container not found');
    }
  }

  private setupPWAInstallPrompt(): void {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show install button or notification
      this.showInstallPrompt(deferredPrompt);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallPrompt();
    });
  }

  private showInstallPrompt(deferredPrompt: any): void {
    // Create install button
    const installButton = document.createElement('button');
    installButton.className = 'install-prompt btn btn-primary';
    installButton.textContent = 'Install App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.zIndex = '1000';

    installButton.addEventListener('click', async () => {
      // Hide the install button
      installButton.remove();

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      // Clear the deferredPrompt
      deferredPrompt = null;
    });

    document.body.appendChild(installButton);
  }

  private hideInstallPrompt(): void {
    const installButton = document.querySelector('.install-prompt');
    if (installButton) {
      installButton.remove();
    }
  }

  private setupOfflineDetection(): void {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      document.body.classList.toggle('offline', !isOnline);
      
      if (!isOnline) {
        this.showOfflineNotification();
      } else {
        this.hideOfflineNotification();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }

  private showOfflineNotification(): void {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>You're currently offline. Some features may be limited.</span>
        <button class="btn btn-sm btn-ghost" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: #f59e0b;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 1000;
    `;
    
    document.body.appendChild(notification);
  }

  private hideOfflineNotification(): void {
    const notification = document.querySelector('.offline-notification');
    if (notification) {
      notification.remove();
    }
  }
}

// Initialize the application
new AppController();

// Export for SSR compatibility
export { App };