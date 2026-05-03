import { Link } from 'react-router-dom'
import styles from './LegalPage.module.css'

const LAST_UPDATED = '1 May 2025'
const COMPANY = 'KDA Analytics'
const EMAIL = 'info@kdaanalytics.com'
const ADDRESS = 'Delhi NCR Region, India'

export default function PrivacyPolicyPage() {
  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <p className="section-label">Legal</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.meta}>Last updated: {LAST_UPDATED}</p>
      </div>

      <div className={styles.container}>
        <div className={styles.notice}>
          This Privacy Policy is published in compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>. It applies to all users accessing our website and services from India, including the State of Uttar Pradesh.
        </div>

        <section className={styles.section}>
          <h2>1. Identity of the Data Fiduciary</h2>
          <p><strong>{COMPANY}</strong> ("we", "our", "us") is the Data Fiduciary under the DPDPA 2023 and the data controller under the IT (SPDI) Rules, 2011. We are responsible for the lawful collection, processing, and protection of your personal data.</p>
          <ul>
            <li><strong>Business Name:</strong> {COMPANY}</li>
            <li><strong>Registered Address:</strong> {ADDRESS}</li>
            <li><strong>Contact Email:</strong> {EMAIL}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We collect the following categories of personal data when you interact with our website or services:</p>

          <h3>2.1 Information You Provide Directly</h3>
          <ul>
            <li>Full name (first name and last name)</li>
            <li>Business email address</li>
            <li>Company or organisation name</li>
            <li>Phone number (optional)</li>
            <li>Nature of inquiry / area of interest</li>
            <li>Message content submitted through our contact form</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>IP address and approximate geographic location</li>
            <li>Browser type, version, and operating system</li>
            <li>Pages visited, referral URLs, and session duration</li>
            <li>Device identifiers and screen resolution</li>
          </ul>

          <h3>2.3 Sensitive Personal Data or Information (SPDI)</h3>
          <p>We do not intentionally collect Sensitive Personal Data or Information (SPDI) as defined under Rule 3 of the IT (SPDI) Rules, 2011, which includes passwords, financial information, biometric data, and health information. If any SPDI is inadvertently submitted, it will be deleted promptly upon identification.</p>
        </section>

        <section className={styles.section}>
          <h2>3. Purpose of Collection and Use</h2>
          <p>Your personal data is collected and used for the following lawful purposes:</p>
          <ul>
            <li>Responding to your enquiries and communications submitted through our contact form</li>
            <li>Providing information about our AI products and data analytics services</li>
            <li>Scheduling calls, demos, and business consultations</li>
            <li>Sending transactional communications including acknowledgment emails</li>
            <li>Improving the functionality, security, and content of our website</li>
            <li>Compliance with applicable legal obligations under Indian law</li>
            <li>Detecting and preventing fraud, abuse, or security incidents</li>
          </ul>
          <p>We will not use your personal data for purposes other than those stated above without obtaining your prior consent.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Legal Basis for Processing</h2>
          <p>We process your personal data on the following legal bases as recognised under the DPDPA 2023 and IT Act, 2000:</p>
          <ul>
            <li><strong>Consent:</strong> When you voluntarily submit your information through our contact form or subscribe to communications, you provide explicit consent for processing.</li>
            <li><strong>Legitimate Interest:</strong> To operate, improve, and secure our website and services in a manner that does not override your fundamental rights.</li>
            <li><strong>Legal Obligation:</strong> Where processing is necessary to comply with any law, court order, or direction by a competent authority in India.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Disclosure to Third Parties</h2>
          <p>We do not sell, trade, or rent your personal data to third parties. We may share your data in the following limited circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With trusted third-party vendors (email delivery services, analytics providers) who process data solely on our behalf and under strict confidentiality obligations.</li>
            <li><strong>Legal Requirements:</strong> Where disclosure is required by law, regulation, court order, or a government or regulatory authority in India, including requests from law enforcement agencies under the IT Act, 2000 or DPDPA 2023.</li>
            <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections.</li>
          </ul>
          <p>Any third-party service providers we engage are contractually required to maintain the confidentiality and security of your personal data and are prohibited from using it for any purpose other than fulfilling their services to us.</p>
        </section>

        <section className={styles.section}>
          <h2>6. Data Retention</h2>
          <p>We retain your personal data only for as long as is necessary to fulfil the purposes for which it was collected, or as required by applicable law:</p>
          <ul>
            <li>Contact form submissions: retained for a maximum of <strong>3 years</strong> from the date of submission for business correspondence purposes.</li>
            <li>Website usage logs: retained for up to <strong>12 months</strong> for security and analytics purposes.</li>
            <li>Email communications: retained in accordance with our email archival policy and applicable Indian tax and corporate record-keeping requirements under the Companies Act, 2013.</li>
          </ul>
          <p>Upon expiry of the retention period, personal data is securely deleted or anonymised.</p>
        </section>

        <section className={styles.section}>
          <h2>7. Security Practices and Procedures</h2>
          <p>We implement reasonable security practices and procedures as mandated under Rule 8 of the IT (SPDI) Rules, 2011, and the DPDPA 2023, including:</p>
          <ul>
            <li>Encryption of data in transit using TLS/HTTPS protocols</li>
            <li>Access controls limiting data access to authorised personnel only</li>
            <li>Regular security assessments and vulnerability reviews</li>
            <li>Secure storage practices with appropriate logical and physical safeguards</li>
            <li>Incident response procedures for detecting, reporting, and remediating data breaches</li>
          </ul>
          <p>In the event of a personal data breach that is likely to result in risk to your rights, we will notify you and the relevant authorities as required under applicable law.</p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>Our website may use cookies and similar tracking technologies to enhance your browsing experience and collect analytical data. These may include:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function correctly.</li>
            <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with our website (e.g., page views, session duration). Data collected is aggregated and anonymised.</li>
          </ul>
          <p>You may configure your browser to refuse cookies or to alert you when cookies are being sent. However, disabling certain cookies may affect the functionality of the website.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Your Rights as a Data Principal</h2>
          <p>Under the DPDPA 2023 and IT (SPDI) Rules, 2011, you have the following rights with respect to your personal data:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request confirmation of whether we hold your personal data and obtain a copy thereof.</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data where it is no longer necessary for the purposes for which it was collected, subject to legal retention obligations.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent to processing at any time, without affecting the lawfulness of processing carried out prior to withdrawal.</li>
            <li><strong>Right to Grievance Redressal:</strong> Lodge a complaint with our Grievance Officer regarding any violation of your privacy rights.</li>
            <li><strong>Right to Nominate:</strong> Under the DPDPA 2023, nominate another individual to exercise your rights in the event of your death or incapacity.</li>
          </ul>
          <p>To exercise any of the above rights, please contact our Grievance Officer at the details provided in Section 11 below.</p>
        </section>

        <section className={styles.section}>
          <h2>10. Cross-Border Data Transfers</h2>
          <p>Your personal data is primarily stored and processed within India. In cases where we engage third-party service providers located outside India (e.g., cloud infrastructure providers), we ensure that adequate safeguards are in place in compliance with the DPDPA 2023 and any applicable rules or orders issued by the Central Government of India regarding cross-border data transfers.</p>
        </section>

        <section className={styles.section}>
          <h2>11. Grievance Officer</h2>
          <p>In accordance with the IT (SPDI) Rules, 2011 (Rule 5(9)) and DPDPA 2023, we have designated a Grievance Officer to address any complaints or concerns regarding this Privacy Policy or the handling of your personal data:</p>
          <div className={styles.contactBox}>
            <p><strong>Grievance Officer</strong></p>
            <p>{COMPANY}</p>
            <p>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            <p>Address: {ADDRESS}</p>
            <p>Response time: We endeavour to acknowledge grievances within <strong>48 hours</strong> and resolve them within <strong>30 days</strong> of receipt.</p>
          </div>
          <p>If you are not satisfied with our response, you may lodge a complaint with the <strong>Data Protection Board of India</strong> once constituted under Section 18 of the DPDPA 2023, or approach the competent court of jurisdiction as specified below.</p>
        </section>

        <section className={styles.section}>
          <h2>12. Governing Law and Jurisdiction</h2>
          <p>This Privacy Policy shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, including the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, and all rules and regulations made thereunder.</p>
          <p>Any disputes arising out of or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the competent courts situated in <strong>Uttar Pradesh, India</strong>.</p>
        </section>

        <section className={styles.section}>
          <h2>13. Changes to This Policy</h2>
          <p>We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our practices or applicable law. Material changes will be notified on our website with a revised "Last Updated" date. Your continued use of our website after such changes constitutes your acceptance of the updated policy.</p>
        </section>

        <div className={styles.backLinks}>
          <Link to="/" className="btn-outline">← Back to Home</Link>
          <Link to="/terms-of-service" className={styles.switchLink}>Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}
