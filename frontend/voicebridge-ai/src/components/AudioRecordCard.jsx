import { useNavigate } from 'react-router-dom'
import styles from './AudioRecordCard.module.css'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AudioRecordCard({ record, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className={styles.card}>
      <div className={styles.left} onClick={() => navigate(`/transcripts/${record.id}`)}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>◎</span>
        </div>
        <div>
          <p className={styles.title}>
            {record.title || record.audio_file?.split('/').pop() || `Record #${record.id}`}
          </p>
          <p className={styles.meta}>
            {formatDate(record.created_at)}
            {record.duration ? ` · ${record.duration}` : ''}
          </p>
        </div>
      </div>
      <div className={styles.right}>
        {record.summary && (
          <span className={styles.badge}>summarised</span>
        )}
        <button
          className={styles.delete}
          onClick={(e) => { e.stopPropagation(); onDelete(record.id) }}
          title="Delete record"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
