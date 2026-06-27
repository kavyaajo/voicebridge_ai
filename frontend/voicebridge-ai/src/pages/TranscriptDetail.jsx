import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAudioRecord, generateSummary } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Alert from '../components/Alert'
import styles from './TranscriptDetail.module.css'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function TranscriptDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summarising, setSummarising] = useState(false)
  const [summaryError, setSummaryError] = useState('')

  useEffect(() => {
    fetchRecord()
  }, [id])

  const fetchRecord = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getAudioRecord(id)
      setRecord(data)
    } catch (err) {
      setError(err.response?.status === 404 ? 'Record not found.' : 'Failed to load record.')
    } finally {
      setLoading(false)
    }
  }

  const handleSummarise = async () => {
    if (!record) return
    setSummarising(true)
    setSummaryError('')
    try {
      const payload = { audio_id: record.id }
      if (record.transcript) payload.transcript = record.transcript
      const { data } = await generateSummary(payload)
      setRecord((prev) => ({ ...prev, ...data }))
    } catch (err) {
      setSummaryError(err.response?.data?.detail || 'Summary generation failed.')
    } finally {
      setSummarising(false)
    }
  }

  const actionItems = Array.isArray(record?.action_items)
    ? record.action_items
    : typeof record?.action_items === 'string'
      ? record.action_items.split('\n').filter(Boolean)
      : []

  const keyDetails = Array.isArray(record?.important_names_dates)
    ? record.important_names_dates
    : typeof record?.important_names_dates === 'string'
      ? record.important_names_dates.split(',').map((s) => s.trim()).filter(Boolean)
      : []

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <Alert type="error" message={error} />
          <Link to="/history"><Button variant="outline">← Back to history</Button></Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>

        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate('/history')}>
            ← History
          </button>
          <span className={styles.idBadge}># {record.id}</span>
        </div>

        <div className={styles.meta}>
          <h1 className={styles.title}>
            {record.title || record.audio_file?.split('/').pop() || `Record #${record.id}`}
          </h1>
          <p className={styles.date}>{formatDate(record.created_at)}</p>
        </div>

        <Alert type="error" message={summaryError} />

        {record.summary ? (
          <div className={styles.results}>
            <Card>
              <p className={styles.cardLabel}>Summary</p>
              <p className={styles.summaryText}>{record.summary}</p>
            </Card>

            {actionItems.length > 0 && (
              <Card>
                <p className={styles.cardLabel}>Action items</p>
                <ul className={styles.actionList}>
                  {actionItems.map((item, i) => (
                    <li key={i} className={styles.actionItem}>
                      <span className={styles.bullet}>→</span>
                      {item.replace(/^[-*•]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {keyDetails.length > 0 && (
              <Card>
                <p className={styles.cardLabel}>Key names & dates</p>
                <div className={styles.tagCloud}>
                  {keyDetails.map((tag, i) => (
                    <span key={i} className={styles.detailTag}>{tag}</span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className={styles.noSummary}>
            <p className={styles.noSummaryText}>No summary generated yet for this record.</p>
            <Button variant="accent" onClick={handleSummarise} loading={summarising}>
              Generate Summary Now
            </Button>
          </div>
        )}

        {record.transcript && (
          <details className={styles.transcriptDetails}>
            <summary className={styles.transcriptToggle}>View transcript</summary>
            <pre className={styles.transcriptText}>{record.transcript}</pre>
          </details>
        )}
      </div>
    </main>
  )
}
