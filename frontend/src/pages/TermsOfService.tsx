import { Link } from 'react-router-dom'
import styles from './LegalPage.module.css'

const LAST_UPDATED = '1 May 2025'
const COMPANY = 'KDA Analytics'
const EMAIL = 'info@kdaanalytics.com'
const ADDRESS = 'Delhi NCR Region, India'
const WEBSITE = 'kdaanalytics.com'

export default function TermsOfServicePage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">Legal</p>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.meta}>Last updated: {LAST_UPDATED}</p>
      </div>

      <div className={styles.container}>
        <div className={styles.notice}>
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and <strong>{COMPANY}</strong> ("Company", "we", "us", "our"), governed by the <strong>Indian Contract Act, 1872</strong>, the <strong>Information Technology Act, 2000</strong>, the <strong>Consumer Protection Act, 2019</strong>, and all applicable rules and regulations of the <strong>Republic of India</strong> and the <strong>State of Uttar Pradesh</strong>. By accessing or using our website at <strong>{WEBSITE}</strong>, you agree to be bound by these Terms.
        </div>

        <section className={styles.section}>
          <h2>1. Parties to the Agreement</h2>
          <p><strong>{COMPANY}</strong> is a technology and artificial intelligence services company registered and operating in India, providing AI-powered products, data analytics services, and business intelligence solutions.</p>
          <ul>
            <li><strong>Business Name:</strong> {COMPANY}</li>
            <li><strong>Registered Address:</strong> {ADDRESS}</li>
            <li><strong>Contact:</strong> {EMAIL}</li>
            <li><strong>Website:</strong> {WEBSITE}</li>
          </ul>
          <p>These Terms apply to all visitors, users, and others who access our website or engage with our services.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Acceptance of Terms</h2>
          <p>By accessing our website or using any of our services, you confirm that:</p>
          <ul>
            <li>You are at least 18 years of age and possess the legal capacity to enter into a binding contract under the Indian Contract Act, 1872.</li>
            <li>If you are representing a company or legal entity, you have the authority to bind that entity to these Terms.</li>
            <li>You have read, understood, and agree to be bound by these Terms and our Privacy Policy.</li>
          </ul>
          <p>If you do not agree to these Terms, you must immediately cease using our website and services.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Services Offered</h2>
          <p>{COMPANY} offers the following categories of services and products through its website:</p>
          <ul>
            <li><strong>AI Products:</strong> Enterprise Chatbot, Fraud Detection, Agentic AI Platform, AML Solution, and other AI-powered software solutions.</li>
            <li><strong>Data Services:</strong> AI Market Research, AI Strategy Consulting, and API & Data Solutions.</li>
            <li><strong>Business Engagements:</strong> Consulting, enterprise partnerships, and custom AI implementation services.</li>
          </ul>
          <p>The website serves as an informational and lead-generation platform. Specific service agreements, pricing, and deliverables are governed by separate commercial contracts executed between the parties.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Intellectual Property Rights</h2>
          <p>All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the exclusive property of {COMPANY} or its licensors and is protected under the <strong>Copyright Act, 1957</strong>, the <strong>Trade Marks Act, 1999</strong>, and other applicable intellectual property laws of India.</p>
          <ul>
            <li>You may not reproduce, distribute, modify, display, or create derivative works of any content without our prior written consent.</li>
            <li>The {COMPANY} name, logo, and all related product names are trademarks of {COMPANY}.</li>
            <li>Nothing in these Terms grants you any licence or right to use our intellectual property except as explicitly permitted herein.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Permitted Use</h2>
          <p>You are permitted to access and use our website solely for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the website in any manner that violates any applicable Indian or international law or regulation.</li>
            <li>Transmit any unsolicited or unauthorised advertising, promotional material, spam, or any other form of solicitation.</li>
            <li>Attempt to gain unauthorised access to any portion of our website, server, or any system connected to our website.</li>
            <li>Use automated tools, bots, scrapers, or crawlers to extract data from our website without our written permission.</li>
            <li>Introduce viruses, trojans, worms, or other malicious or technologically harmful material in violation of the IT Act, 2000.</li>
            <li>Impersonate {COMPANY}, its employees, or any other person or entity.</li>
            <li>Engage in any activity that could damage, disable, overburden, or impair our servers or networks.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Contact Form and Communications</h2>
          <p>When you submit an enquiry through our contact form, you acknowledge that:</p>
          <ul>
            <li>The information provided is accurate and complete to the best of your knowledge.</li>
            <li>Submission of the form constitutes consent to receive a response from {COMPANY} via email or phone.</li>
            <li>We may retain your contact details for business correspondence in accordance with our Privacy Policy.</li>
            <li>Submitting a contact form does not create a binding contractual obligation on either party; such obligations arise only upon execution of a formal written agreement.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Disclaimer of Warranties</h2>
          <p>Our website and all content therein are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis, without warranties of any kind, either express or implied, to the maximum extent permitted under Indian law.</p>
          <ul>
            <li>We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
            <li>We do not guarantee the accuracy, completeness, or currency of any information on the website.</li>
            <li>Nothing on this website constitutes legal, financial, investment, or professional advice.</li>
            <li>Product descriptions and capabilities listed on this website are indicative only; actual deliverables are governed by executed service agreements.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Limitation of Liability</h2>
          <p>To the fullest extent permissible under the laws of India, {COMPANY}, its directors, employees, agents, and affiliates shall not be liable for:</p>
          <ul>
            <li>Any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our website.</li>
            <li>Any loss of data, revenue, profits, or business opportunities arising from reliance on information contained on the website.</li>
            <li>Any damages resulting from unauthorised access to or alteration of your transmissions or data.</li>
          </ul>
          <p>Where liability cannot be excluded under the <strong>Consumer Protection Act, 2019</strong> or other mandatory Indian laws, our liability shall be limited to the maximum extent permitted thereunder.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites for informational purposes. These links do not constitute an endorsement or recommendation by {COMPANY}. We have no control over the content, privacy practices, or terms of third-party websites and accept no responsibility for any loss or damage arising from your use of such sites.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Privacy and Data Protection</h2>
          <p>Your use of our website is also governed by our <Link to="/privacy-policy" className={styles.inlineLink}>Privacy Policy</Link>, which is incorporated into these Terms by reference. By using our website, you consent to the collection and use of your personal data as described in the Privacy Policy, in compliance with the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>IT (SPDI) Rules, 2011</strong>.</p>
        </section>

        <section className={styles.section}>
          <h2>11. Compliance with MCA and Regulatory Requirements</h2>
          <p>{COMPANY} operates in compliance with the requirements of the <strong>Ministry of Corporate Affairs (MCA), Government of India</strong>, including:</p>
          <ul>
            <li>Disclosure of company identity and contact information as required under the Companies Act, 2013 and the Companies (Registration of Offices and Fees) Rules, 2014.</li>
            <li>Maintenance of statutory records and compliance with applicable filing requirements.</li>
            <li>Adherence to the MCA's directives on digital and electronic records under the IT Act, 2000.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>12. Applicable Law — Uttar Pradesh</h2>
          <p>Users accessing our services from the <strong>State of Uttar Pradesh</strong> acknowledge that the following additional frameworks apply to their use:</p>
          <ul>
            <li>The <strong>Uttar Pradesh Shops and Commercial Establishments Act, 1962</strong> (as amended), to the extent applicable to commercial transactions initiated in UP.</li>
            <li>The <strong>Uttar Pradesh Information Technology Policy</strong> and applicable state-level IT regulations.</li>
            <li>All applicable orders and directions of the <strong>Government of Uttar Pradesh</strong> pertaining to digital services, data security, and consumer protection.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>13. Dispute Resolution</h2>
          <p>In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the use of our website, the parties agree to attempt resolution through good-faith negotiation in the first instance.</p>
          <p>If the dispute is not resolved within <strong>30 days</strong> of written notice, either party may seek resolution through:</p>
          <ul>
            <li><strong>Arbitration</strong> under the Arbitration and Conciliation Act, 1996 (as amended), with a sole arbitrator appointed by mutual agreement, conducted in English, with the seat of arbitration in Uttar Pradesh; or</li>
            <li><strong>Litigation</strong> before the competent civil courts having jurisdiction in <strong>Uttar Pradesh, India</strong>.</li>
          </ul>
          <p>Nothing herein prevents either party from seeking interim or injunctive relief from a competent court.</p>
        </section>

        <section className={styles.section}>
          <h2>14. Governing Law and Jurisdiction</h2>
          <p>These Terms shall be governed by and construed exclusively in accordance with the laws of the <strong>Republic of India</strong>. Any legal proceedings arising out of or in connection with these Terms shall be brought exclusively before the courts of competent jurisdiction in <strong>Uttar Pradesh, India</strong>.</p>
        </section>

        <section className={styles.section}>
          <h2>15. Amendments to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time at our sole discretion. Material changes will be indicated by a revised "Last Updated" date at the top of this page. Your continued use of our website following the publication of revised Terms constitutes your acceptance of those changes. We encourage you to review these Terms periodically.</p>
        </section>

        <section className={styles.section}>
          <h2>16. Severability</h2>
          <p>If any provision of these Terms is held by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.</p>
        </section>

        <section className={styles.section}>
          <h2>17. Contact Us</h2>
          <p>For any questions, concerns, or notices regarding these Terms, please contact us at:</p>
          <div className={styles.contactBox}>
            <p><strong>{COMPANY}</strong></p>
            <p>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            <p>Address: {ADDRESS}</p>
          </div>
        </section>

        <div className={styles.backLinks}>
          <Link to="/" className="btn-outline">← Back to Home</Link>
          <Link to="/privacy-policy" className={styles.switchLink}>Privacy Policy →</Link>
        </div>
      </div>
    </div>
  )
}
