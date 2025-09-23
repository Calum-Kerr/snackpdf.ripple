import { BaseRippleComponent } from '../types/ripple';
import './LegalPages.css';

export interface LegalPagesProps {
  currentPage: string;
  onBack: () => void;
}

export class LegalPages extends BaseRippleComponent {
  constructor(props: LegalPagesProps) {
    super({ className: 'legal-pages', props });
  }

  render(): void {
    const content = this.getPageContent(this.props.currentPage);
    
    this.element.innerHTML = `
      <div class="legal-content">
        <div class="legal-header">
          <button class="back-button">
            ${this.createIcon('arrow_back').outerHTML}
            Back to SnackPDF
          </button>
          <h1>${content.title}</h1>
          <p class="last-updated">Last updated: ${content.lastUpdated}</p>
        </div>
        
        <div class="legal-body">
          ${content.body}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getPageContent(page: string): { title: string; lastUpdated: string; body: string } {
    const currentDate = new Date().toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    switch (page) {
      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          lastUpdated: currentDate,
          body: this.getPrivacyPolicyContent()
        };
      case 'terms-conditions':
        return {
          title: 'Terms and Conditions',
          lastUpdated: currentDate,
          body: this.getTermsConditionsContent()
        };
      case 'cookie-policy':
        return {
          title: 'Cookie Policy',
          lastUpdated: currentDate,
          body: this.getCookiePolicyContent()
        };
      case 'data-protection':
        return {
          title: 'Data Protection Notice',
          lastUpdated: currentDate,
          body: this.getDataProtectionContent()
        };
      default:
        return {
          title: 'Legal Information',
          lastUpdated: currentDate,
          body: '<p>Legal page not found.</p>'
        };
    }
  }

  private getPrivacyPolicyContent(): string {
    return `
      <h2>1. Introduction</h2>
      <p>This Privacy Policy explains how SnackPDF ("we", "our", or "us") collects, uses, and protects your personal information when you use our website and services. We are committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
      
      <h2>2. Who We Are</h2>
      <p>SnackPDF is operated from Edinburgh, Scotland, United Kingdom. We are the data controller for the personal information we collect about you.</p>
      
      <h2>3. Information We Collect</h2>
      <h3>3.1 Information You Provide</h3>
      <ul>
        <li>Feature requests and feedback you submit</li>
        <li>Any correspondence you send to us</li>
      </ul>
      
      <h3>3.2 Information We Collect Automatically</h3>
      <ul>
        <li>Technical information about your device and browser</li>
        <li>Usage data about how you interact with our website</li>
        <li>IP address and location data</li>
      </ul>
      
      <h2>4. How We Use Your Information</h2>
      <p>We use your personal information to:</p>
      <ul>
        <li>Provide and improve our PDF tools and services</li>
        <li>Respond to your feature requests and enquiries</li>
        <li>Analyse website usage to enhance user experience</li>
        <li>Comply with legal obligations</li>
      </ul>
      
      <h2>5. Legal Basis for Processing</h2>
      <p>Under UK GDPR, we process your personal information based on:</p>
      <ul>
        <li><strong>Legitimate interests:</strong> To provide and improve our services</li>
        <li><strong>Consent:</strong> Where you have given explicit consent</li>
        <li><strong>Legal obligation:</strong> To comply with applicable laws</li>
      </ul>
      
      <h2>6. Data Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:</p>
      <ul>
        <li>To comply with legal requirements</li>
        <li>To protect our rights and safety</li>
        <li>With service providers who assist in operating our website</li>
      </ul>
      
      <h2>7. Data Retention</h2>
      <p>We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy or as required by law.</p>
      
      <h2>8. Your Rights</h2>
      <p>Under UK data protection law, you have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to processing</li>
        <li>Data portability</li>
        <li>Withdraw consent</li>
      </ul>
      
      <h2>9. Data Security</h2>
      <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>
      
      <h2>10. International Transfers</h2>
      <p>Your personal information is processed within the United Kingdom. Any transfers outside the UK will be protected by appropriate safeguards.</p>
      
      <h2>11. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.</p>
      
      <h2>12. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us via our LinkedIn profile.</p>
      
      <p><strong>Supervisory Authority:</strong> If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank">ico.org.uk</a>.</p>
    `;
  }

  private getTermsConditionsContent(): string {
    return `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using SnackPDF, you accept and agree to be bound by the terms and provision of this agreement. These Terms and Conditions are governed by Scottish law and the jurisdiction of Scottish courts.</p>
      
      <h2>2. Service Description</h2>
      <p>SnackPDF provides online PDF manipulation tools and services. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.</p>
      
      <h2>3. User Responsibilities</h2>
      <h3>3.1 Acceptable Use</h3>
      <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
      <ul>
        <li>Upload content that infringes copyright or other intellectual property rights</li>
        <li>Attempt to gain unauthorised access to our systems</li>
        <li>Use our services for any illegal or harmful activities</li>
        <li>Interfere with or disrupt our services</li>
      </ul>
      
      <h3>3.2 Content Responsibility</h3>
      <p>You are solely responsible for any content you upload or process through our services. You warrant that you have the right to use such content.</p>
      
      <h2>4. Intellectual Property</h2>
      <p>All intellectual property rights in SnackPDF, including software, design, and content, belong to us or our licensors. You may not reproduce, distribute, or create derivative works without permission.</p>
      
      <h2>5. Privacy and Data Processing</h2>
      <p>Your use of our services is also governed by our Privacy Policy. We process uploaded files temporarily and do not store them permanently on our servers.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law:</p>
      <ul>
        <li>Our services are provided "as is" without warranties</li>
        <li>We shall not be liable for any indirect, incidental, or consequential damages</li>
        <li>Our total liability shall not exceed the amount paid by you for our services</li>
      </ul>
      
      <h2>7. Indemnification</h2>
      <p>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our services or violation of these Terms.</p>
      
      <h2>8. Termination</h2>
      <p>We may terminate or suspend your access to our services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.</p>
      
      <h2>9. Force Majeure</h2>
      <p>We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including natural disasters, government actions, or technical failures.</p>
      
      <h2>10. Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with Scottish law. Any disputes shall be subject to the exclusive jurisdiction of Scottish courts.</p>
      
      <h2>11. Severability</h2>
      <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
      
      <h2>12. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the new Terms.</p>
      
      <h2>13. Contact Information</h2>
      <p>For questions about these Terms and Conditions, please contact us via our LinkedIn profile.</p>
    `;
  }

  private getCookiePolicyContent(): string {
    return `
      <h2>1. What Are Cookies</h2>
      <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better browsing experience and allow certain features to function properly.</p>
      
      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      
      <h3>2.1 Essential Cookies</h3>
      <p>These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.</p>
      
      <h3>2.2 Performance Cookies</h3>
      <p>These cookies collect information about how visitors use our website, such as which pages are most visited and if users encounter error messages. This information helps us improve how our website works.</p>
      
      <h3>2.3 Functionality Cookies</h3>
      <p>These cookies allow our website to remember choices you make (such as your preferred settings) and provide enhanced, more personalised features.</p>
      
      <h2>3. Types of Cookies We Use</h2>
      <table class="cookie-table">
        <thead>
          <tr>
            <th>Cookie Type</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session Cookies</td>
            <td>Essential for website functionality</td>
            <td>Session only</td>
          </tr>
          <tr>
            <td>Preference Cookies</td>
            <td>Remember your settings and preferences</td>
            <td>30 days</td>
          </tr>
          <tr>
            <td>Analytics Cookies</td>
            <td>Help us understand website usage</td>
            <td>2 years</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Third-Party Cookies</h2>
      <p>Some cookies may be set by third-party services that appear on our pages. We have no control over these cookies, and you should check the relevant third party's website for more information.</p>
      
      <h2>5. Managing Cookies</h2>
      <p>You can control and manage cookies in various ways:</p>
      
      <h3>5.1 Browser Settings</h3>
      <p>Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:</p>
      <ul>
        <li>Accept all cookies</li>
        <li>Reject all cookies</li>
        <li>Notify you when a cookie is set</li>
        <li>Delete cookies</li>
      </ul>
      
      <h3>5.2 Disabling Cookies</h3>
      <p>Please note that disabling cookies may affect the functionality of our website and your user experience.</p>
      
      <h2>6. Cookie Consent</h2>
      <p>By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings.</p>
      
      <h2>7. Updates to This Policy</h2>
      <p>We may update this Cookie Policy from time to time to reflect changes in technology or legislation. Please review this page periodically for any updates.</p>
      
      <h2>8. Contact Us</h2>
      <p>If you have any questions about our use of cookies, please contact us via our LinkedIn profile.</p>
      
      <h2>9. Useful Links</h2>
      <p>For more information about cookies and how to manage them, visit:</p>
      <ul>
        <li><a href="https://www.aboutcookies.org" target="_blank">www.aboutcookies.org</a></li>
        <li><a href="https://ico.org.uk/for-organisations/guide-to-pecr/cookies/" target="_blank">ICO Guidance on Cookies</a></li>
      </ul>
    `;
  }

  private getDataProtectionContent(): string {
    return `
      <h2>1. Introduction</h2>
      <p>This Data Protection Notice explains how SnackPDF processes personal data in compliance with UK data protection laws, including the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
      
      <h2>2. Data Controller</h2>
      <p>SnackPDF, operating from Edinburgh, Scotland, is the data controller responsible for your personal data.</p>
      
      <h2>3. Lawful Basis for Processing</h2>
      <p>We process personal data under the following lawful bases:</p>
      
      <h3>3.1 Legitimate Interests (Article 6(1)(f))</h3>
      <p>We process data to:</p>
      <ul>
        <li>Improve our services and user experience</li>
        <li>Ensure website security and prevent fraud</li>
        <li>Analyse usage patterns for service enhancement</li>
      </ul>
      
      <h3>3.2 Consent (Article 6(1)(a))</h3>
      <p>Where you have explicitly consented to data processing for specific purposes.</p>
      
      <h3>3.3 Legal Obligation (Article 6(1)(c))</h3>
      <p>To comply with legal requirements under UK law.</p>
      
      <h2>4. Categories of Personal Data</h2>
      <p>We may process the following categories of personal data:</p>
      
      <h3>4.1 Identity Data</h3>
      <ul>
        <li>Information provided in feature requests</li>
        <li>Communication preferences</li>
      </ul>
      
      <h3>4.2 Technical Data</h3>
      <ul>
        <li>IP address and location data</li>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>Usage data and analytics</li>
      </ul>
      
      <h2>5. How We Collect Personal Data</h2>
      <p>We collect personal data through:</p>
      <ul>
        <li>Direct interactions with our website</li>
        <li>Automated technologies (cookies, analytics)</li>
        <li>Feature request submissions</li>
      </ul>
      
      <h2>6. Data Sharing and Recipients</h2>
      <p>We may share your personal data with:</p>
      <ul>
        <li>Service providers who assist in website operation</li>
        <li>Legal authorities when required by law</li>
        <li>Professional advisers (lawyers, accountants) under confidentiality agreements</li>
      </ul>
      
      <h2>7. International Transfers</h2>
      <p>Personal data is primarily processed within the United Kingdom. Any international transfers will be protected by appropriate safeguards in accordance with UK GDPR requirements.</p>
      
      <h2>8. Data Retention</h2>
      <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
      <ul>
        <li>Feature requests: Until resolved or no longer relevant</li>
        <li>Analytics data: Maximum 26 months</li>
        <li>Technical logs: Maximum 12 months</li>
      </ul>
      
      <h2>9. Your Rights Under UK GDPR</h2>
      <p>You have the following rights regarding your personal data:</p>
      
      <h3>9.1 Right of Access (Article 15)</h3>
      <p>You can request confirmation of whether we process your personal data and access to that data.</p>
      
      <h3>9.2 Right to Rectification (Article 16)</h3>
      <p>You can request correction of inaccurate or incomplete personal data.</p>
      
      <h3>9.3 Right to Erasure (Article 17)</h3>
      <p>You can request deletion of your personal data in certain circumstances.</p>
      
      <h3>9.4 Right to Restrict Processing (Article 18)</h3>
      <p>You can request limitation of processing in specific situations.</p>
      
      <h3>9.5 Right to Object (Article 21)</h3>
      <p>You can object to processing based on legitimate interests or for direct marketing.</p>
      
      <h3>9.6 Right to Data Portability (Article 20)</h3>
      <p>You can request your data in a structured, commonly used format.</p>
      
      <h3>9.7 Right to Withdraw Consent</h3>
      <p>Where processing is based on consent, you can withdraw it at any time.</p>
      
      <h2>10. Exercising Your Rights</h2>
      <p>To exercise any of your rights, please contact us via our LinkedIn profile. We will respond within one month of receiving your request.</p>
      
      <h2>11. Data Protection Impact Assessments</h2>
      <p>We conduct Data Protection Impact Assessments (DPIAs) for processing activities that pose high risks to individual rights and freedoms.</p>
      
      <h2>12. Data Breach Notification</h2>
      <p>In the event of a data breach that poses risks to your rights and freedoms, we will notify the ICO within 72 hours and inform affected individuals where required.</p>
      
      <h2>13. Complaints</h2>
      <p>If you are dissatisfied with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):</p>
      <ul>
        <li>Website: <a href="https://ico.org.uk" target="_blank">ico.org.uk</a></li>
        <li>Telephone: 0303 123 1113</li>
        <li>Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
      </ul>
      
      <h2>14. Updates to This Notice</h2>
      <p>We may update this Data Protection Notice to reflect changes in law or our processing activities. We will notify you of significant changes.</p>
      
      <h2>15. Contact Information</h2>
      <p>For any data protection enquiries, please contact us via our LinkedIn profile. We are committed to protecting your privacy and will respond to all legitimate requests promptly.</p>
    `;
  }

  private bindEvents(): void {
    const backButton = this.element.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        if (this.props.onBack) {
          this.props.onBack();
        }
      });
    }
  }

  update(props: Partial<LegalPagesProps>): void {
    super.update(props);
  }
}