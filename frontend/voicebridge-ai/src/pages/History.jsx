import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAudioRecords, deleteAudioRecord } from '../services/api'
import AudioRecordCard from '../components/AudioRecordCard'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Alert from '../components/Alert'
import styles from './History.module.css'

export default function History() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getAudioRecords()
      setRecords(Array.isArray(data) ? data : data.results ?? [])
    } catch {
      setError('Could not load your records. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteAudioRecord(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch {
      setError('Delete failed. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Audio history</h1>
            <p className={styles.sub}>All your uploaded recordings and transcripts</p>
          </div>
          <Link to="/dashboard">
            <Button variant="accent">+ New transcript</Button>
          </Link>
        </div>

        <Alert type="error" message={error} />

        {loading ? (
          <div className={styles.skeletonWrap}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            icon="◎"
            title="No recordings yet"
            description="Upload an audio file or paste a transcript on the dashboard to get started."
            action={
              <Link to="/dashboard">
                <Button variant="accent">Go to workspace</Button>
              </Link>
            }
          />
        ) : (
          <div className={styles.list}>
            {records.map((record) => (
              <AudioRecordCard
                key={record.id}
                record={record}
                onDelete={deletingId === record.id ? () => {} : handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
