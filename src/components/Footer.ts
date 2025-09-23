import { BaseRippleComponent } from '../types/ripple';
import './Footer.css';

export interface FooterProps {
  onPageChange?: (page: string) => void;
}

export class Footer extends BaseRippleComponent {
  constructor(props: FooterProps) {
    super({ className: 'footer', props });
  }

  render(): void {
    this.element.innerHTML = `
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-section company-info">
            <h3>SnackPDF</h3>
            <p class="company-description">Your locally hosted one-stop-shop for all your PDF needs.</p>
            <p class="journey-text">Started this PDF website journey on 13th May 2024, constantly restarting, learning from failures and mistakes, trying new UI and UX approaches.</p>
          </div>
          
          <div class="footer-section links-section">
            <h4>Legal</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link" data-page="privacy-policy">Privacy Policy</a></li>
              <li><a href="#" class="footer-link" data-page="terms-conditions">Terms & Conditions</a></li>
              <li><a href="#" class="footer-link" data-page="cookie-policy">Cookie Policy</a></li>
              <li><a href="#" class="footer-link" data-page="data-protection">Data Protection</a></li>
            </ul>
          </div>
          
          <div class="footer-section social-section">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="https://linkedin.com/in/calum-x-kerr" target="_blank" class="social-link linkedin">
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">© ${new Date().getFullYear()} SnackPDF. All rights reserved.</p>
            <p class="location">Based in Edinburgh, Scotland, United Kingdom</p>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const footerLinks = this.element.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (e.currentTarget as HTMLElement).dataset.page;
        if (page && this.props.onPageChange) {
          this.props.onPageChange(page);
        }
      });
    });
  }

  update(props: Partial<FooterProps>): void {
    super.update(props);
  }
}