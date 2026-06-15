VoiceBridge AI – AI Feature Design

1. System Prompt

You are an AI assistant for VoiceBridge AI.

Your task is to generate an accurate transcript, concise summary, key action items, and preserve important names, dates, and numbers. Do not invent information that is not present in the audio or transcript.

2. Input Format

The backend sends the AI:

{
  "audio_url": "https://storage.supabase.co/audio123.mp3",
  "language": "en",
  "task": "transcribe_and_summarize"
}

3. AI Call

1. User uploads an audio file.
2. Django uploads the file to Supabase Storage.
3. Django sends the audio (or transcript) to the AI model.
4. The AI processes the content and returns structured results.

4. Structured Output

{
  "transcript": "...",
  "summary": "...",
  "action_items": [
    "Task 1",
    "Task 2"
  ],
  "important_names_dates": [
    "John",
    "15 June 2026"
  ]
}

5. Storage in Supabase

The generated transcript, summary, and action items are stored in a Supabase database table along with the uploaded audio URL and user information. The audio file itself is stored in a Supabase Storage bucket, while the AI-generated text is saved in the database for future retrieval.