import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const steps = [
  { label: 'Upload', desc: 'Drop any audio file — meetings, lectures, voice notes.' },
  { label: 'Transcribe', desc: 'Convert spoken audio into accurate and readable text.' },
  { label: 'Summarise', desc: 'Get a tight summary, action items, and key names/dates.' },
]

export default function Landing() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.tag}>audio → text → insight</div>
          <h1 className={styles.headline}>
            Transform Speech into Smart Insights<br />
          </h1>
          <p className={styles.sub}>
            VoiceBridge turns your audio files into accurate transcripts, concise summaries, and actionable insights in seconds.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.ctaPrimary}>Start for free</Link>
            <Link to="/login" className={styles.ctaSecondary}>I already have an account</Link>
          </div>
        </div>

        <div className={styles.terminalWrap}>
          <div className={`container ${styles.terminalContainer}`}>
            <div className={styles.terminal}>
              <div className={styles.terminalBar}>
                <span className={styles.dot} style={{ background: '#f87171' }} />
                <span className={styles.dot} style={{ background: '#fbbf24' }} />
                <span className={styles.dot} style={{ background: '#34d399' }} />
                <span className={styles.terminalTitle}>voicebridge — response</span>
              </div>
              <pre className={styles.terminalBody}>{`{
  "summary": "Team decided to shift sprint deadline
              by 3 days and assign Rahul as point
              of contact for the client.",

  "action_items": [
    "Rahul to send revised timeline by Friday",
    "Meera to update Jira with new milestones"
  ],

  "key_entities": [
    "Rahul", "Meera", "Friday", "Sprint 14"
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className="container">
          <p className={styles.sectionEyebrow}>How it works</p>
          <div className={styles.steps}>
            {steps.map((s, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className={styles.stepLabel}>{s.label}</p>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to analyse your audio?</h2>
            <p className={styles.ctaDesc}>Upload a recording and let VoiceBridge create structured insights for you.</p>
            <Link to="/register" className={styles.ctaPrimary}>Get started — it's free</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
