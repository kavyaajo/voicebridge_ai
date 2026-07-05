import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { generateSummary, uploadAudio } from '../services/api'
import Button from '../components/Button'
import Alert from '../components/Alert'
import Card from '../components/Card'
import styles from './Dashboard.module.css'
import { Link } from "react-router-dom"; 

const TABS = ['Paste transcript', 'Upload audio']

export default function Dashboard() {
  const { user } = useAuth()
  const fileRef = useRef(null)

  const [tab, setTab] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [audioId, setAudioId] = useState('')

  const [uploading, setUploading] = useState(false)
  const [summarising, setSummarising] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [summaryError, setSummaryError] = useState('')
  const [result, setResult] = useState(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (file) setAudioFile(file)
  }

  const handleUpload = async () => {
    if (!audioFile) return
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('audio_file', audioFile)
      const { data } = await uploadAudio(fd)
      setAudioId(data.id)
      if (data.transcript) setTranscript(data.transcript)
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Upload failed. Check file format and try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSummarise = async () => {
    if (!transcript.trim() && !audioId) return
    setSummarising(true)
    setSummaryError('')
    setResult(null)
    try {
      const payload = {}
      if (audioId) payload.audio_id = audioId
      if (transcript.trim()) payload.transcript = transcript.trim()
      const { data } = await generateSummary(payload) 
      console.log(data) 
      setResult(data)
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.error
      setSummaryError(detail || 'Failed to generate summary. Please try again.')
    } finally {
      setSummarising(false)
    }
  }

  const canSummarise = (tab === 0 && transcript.trim().length > 20) || (tab === 1 && !!audioId)

  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>

        <div className={styles.greeting}>
  <h1 className={styles.title}>
    Hey, {user?.username} —
  </h1>

  <p className={styles.sub}>
    Paste a transcript or upload audio to get your summary.
  </p>

  <Link to="/agent">
    <button
      style={{
        marginTop: "15px",
        padding: "10px 20px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      🤖 VoiceBridge AI Assistant
    </button>
  </Link>
</div>

        <div className={styles.workArea}>
          <div className={styles.inputPanel}>
            <div className={styles.tabRow}>
              {TABS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTab(i)}
                  className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 0 && (
              <div className={styles.textInputWrap}>
                <textarea
                  className={styles.textarea}
                  placeholder="Paste your meeting transcript, lecture notes, or voice note text here…"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={12}
                />
                <div className={styles.textareaFooter}>
                  <span className={styles.charCount}>
                    {transcript.length > 0 ? `${transcript.length} characters` : 'Min. 20 characters required'}
                  </span>
                  {transcript.length > 0 && (
                    <button className={styles.clearBtn} onClick={() => { setTranscript(''); setResult(null) }}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {tab === 1 && (
              <div className={styles.uploadWrap}>
                <div
                  className={`${styles.dropzone} ${audioFile ? styles.dropzoneFilled : ''}`}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={handleFileDrop}
                  />
                  {audioFile ? (
                    <>
                      <span className={styles.fileIcon}>◎</span>
                      <p className={styles.fileName}>{audioFile.name}</p>
                      <p className={styles.fileSize}>
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>↑</span>
                      <p className={styles.dropText}>Drop audio file here</p>
                      <p className={styles.dropSub}>or click to browse · mp3, wav, m4a, ogg</p>
                    </>
                  )}
                </div>

                {audioFile && !audioId && (
                  <div className={styles.uploadAction}>
                    <Alert type="error" message={uploadError} />
                    <Button onClick={handleUpload} loading={uploading} variant="outline">
                      {uploading ? 'Uploading…' : 'Upload to VoiceBridge'}
                    </Button>
                  </div>
                )}

                {audioId && (
                  <Alert type="success" message={`Audio uploaded — ID ${audioId}. Ready to summarise.`} />
                )}
              </div>
            )}

            <div className={styles.actionRow}>
              <Alert type="error" message={summaryError} />
              <Button
                variant="accent"
                onClick={handleSummarise}
                loading={summarising}
                disabled={!canSummarise}
                fullWidth
              >
                {summarising ? 'Generating summary…' : 'Generate Summary'}
              </Button>
              {!canSummarise && !summarising && (
                <p className={styles.hint}>
                  {tab === 0
                    ? 'Paste at least 20 characters to continue.'
                    : 'Upload an audio file first.'}
                </p>
              )}
            </div>
          </div>

          {result && <ResultPanel result={result} />}
        </div>
      </div>
    </main>
  )
}

function ResultPanel({ result }) {
  const actionItems = Array.isArray(result.action_items)
    ? result.action_items
    : typeof result.action_items === 'string'
      ? result.action_items.split('\n').filter(Boolean)
      : []

  const keyDetails = Array.isArray(result.important_names_dates)
    ? result.important_names_dates
    : typeof result.important_names_dates === 'string'
      ? result.important_names_dates.split(',').map((s) => s.trim()).filter(Boolean)
      : []

  return (
    <div className={styles.results}>
      <div className={styles.resultsBadge}>AI Analysis</div>

      <Card>
        <p className={styles.cardLabel}>Summary</p>
        <p className={styles.summaryText}>{result.summary}</p>
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

      {result.transcript && (
        <details className={styles.transcriptDetails}>
          <summary className={styles.transcriptToggle}>View full transcript</summary>
          <pre className={styles.transcriptText}>{result.transcript}</pre>
        </details>
      )}
    </div>
  )
}
