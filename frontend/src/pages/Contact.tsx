import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { submitContact, ContactPayload } from "@/utils/api";
import styles from "./Contact.module.css";

const INTERESTS = [
  "AI Market Research",
  "AI Strategy Consulting",
  "API & Data Solutions",
  "AI Products Inquiry",
  "General Enquiry",
];

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [leadId, setLeadId] = useState("");

  const [form, setForm] = useState<ContactPayload>({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    interest: INTERESTS[0],
    message: "",
  });

  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const result = await submitContact(form);
      setLeadId(result.lead_id || "");
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(
        err.message || "Something went wrong. Please email us directly.",
      );
      setStatus("error");
    }
  }

  return (
    <div className={`${styles.page} page-enter`}>
      {/* Header */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroLeft}>
          <p className="section-label">Contact</p>
          <h1 className={styles.heroTitle}>Let's build something intelligent</h1>
          <p className={styles.heroSub}>
            Tell us about your goals — our team responds within 24 business hours.
          </p>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24h</div>
              <div className={styles.statLabel}>Response Time</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Response Rate</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>70%</div>
              <div className={styles.statLabel}>Ops Cost Reduction</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Free</div>
              <div className={styles.statLabel}>Initial Consultation</div>
            </div>
          </div>

          <div className={styles.trustPanel}>
            {[
              { icon: '🔒', text: 'Enterprise-grade security & compliance' },
              { icon: '🌐', text: 'Deployable on cloud, on-prem, or hybrid' },
              { icon: '⚡', text: 'Rapid prototyping to production in weeks' },
              { icon: '🤝', text: 'Dedicated team for every engagement' },
            ].map(({ icon, text }) => (
              <div key={text} className={styles.trustRow}>
                <span className={styles.trustIcon}>{icon}</span>
                <span className={styles.trustText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Info column */}
        <aside className={styles.info}>
          <div className={styles.infoCard}>
            <h3>Get in Touch</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>✉️</span>
              <div>
                <div className={styles.infoLabel}>Email</div>
                <a
                  href="mailto:info@kdaanalytics.com"
                  className={styles.infoValue}
                >
                  info@kdaanalytics.com
                </a>
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <div className={styles.infoLabel}>Headquarters</div>
                <div className={styles.infoValue}>Delhi NCR Region, India</div>
              </div>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>⏱️</span>
              <div>
                <div className={styles.infoLabel}>Response Time</div>
                <div className={styles.infoValue}>Within 24 business hours</div>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Our Services</h3>
            {[
              [
                "📊",
                "AI Market Research",
                "Deep-dive intelligence reports",
                "/services/market-research",
              ],
              [
                "🧠",
                "AI Strategy Consulting",
                "Roadmaps & ROI frameworks",
                "/services/ai-strategy-consulting",
              ],
              [
                "⚡",
                "API & Data Solutions",
                "Enterprise data pipelines",
                "/services/api-data-licensing",
              ],
              [
                "🤖",
                "AI Products",
                "Chatbot, Fraud, AML & more",
                "/products",
              ],
            ].map(([icon, title, sub, to]) => (
              <Link
                key={title as string}
                to={to as string}
                className={styles.engRow}
              >
                <span>{icon}</span>
                <div>
                  <div className={styles.engTitle}>{title}</div>
                  <div className={styles.engSub}>{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Form */}
        <div className={styles.formWrap}>
          {status === "success" ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>🎉</div>
              <h2>Message received!</h2>
              <p>
                Thank you for reaching out. Our team will get back to you within
                24 business hours.
              </p>
              {leadId && (
                <p className={styles.leadId}>
                  Reference: <strong>{leadId}</strong>
                </p>
              )}
              <button
                className="btn-outline"
                onClick={() => {
                  setStatus("idle");
                  setForm({
                    first_name: "",
                    last_name: "",
                    email: "",
                    company: "",
                    phone: "",
                    interest: INTERESTS[0],
                    message: "",
                  });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <h2 className={styles.formTitle}>Send a Message</h2>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>First Name *</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={onChange}
                    placeholder="First name"
                    required
                    minLength={2}
                  />
                </div>
                <div className={styles.field}>
                  <label>Last Name *</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={onChange}
                    placeholder="Last name"
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Work Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Company / Organisation</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="Company name"
                />
              </div>

              <div className={styles.field}>
                <label>I'm interested in *</label>
                <select
                  name="interest"
                  value={form.interest}
                  onChange={onChange}
                  required
                >
                  {INTERESTS.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell us about your goals, timeline, or questions…"
                  rows={5}
                  required
                  minLength={10}
                />
              </div>

              {status === "error" && (
                <div className={styles.error}>⚠️ {errorMsg}</div>
              )}

              <button
                type="submit"
                className={`btn-primary ${styles.submit}`}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <span className={styles.spinner} />
                    Sending…
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>

              <p className={styles.privacy}>
                We respect your privacy. Your information is never sold or
                shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
