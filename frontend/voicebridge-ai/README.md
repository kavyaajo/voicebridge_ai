# VoiceBridge AI — React Frontend

A clean, handcrafted React + Vite frontend for the VoiceBridge AI Django REST Framework backend.

---

## Quick Start

### 1. Install dependencies

```bash
cd voicebridge-ai
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Open `.env` and set your backend URL:

```
# Your deployed Railway backend:
VITE_API_BASE_URL=https://voicebridgeai-production.up.railway.app

# OR for local development:
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ No trailing slash. The app prepends paths like `/api/token/` automatically.

### 3. Start dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/         # Reusable UI pieces
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Alert.jsx
│   ├── EmptyState.jsx
│   └── AudioRecordCard.jsx
├── context/
│   └── AuthContext.jsx  # Global auth state (JWT tokens)
├── pages/
│   ├── Landing.jsx      # Home page
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx    # Main workspace
│   ├── History.jsx      # Audio records list
│   └── TranscriptDetail.jsx
├── services/
│   └── api.js          # ← ALL API endpoints live here
├── App.jsx             # Routes
├── main.jsx
└── index.css           # Design tokens + base styles
```

---

## API Endpoints

All API calls go through `src/services/api.js`. Here's exactly what each function hits:

| Function | Method | Endpoint | Used in |
|---|---|---|---|
| `login` | POST | `/api/token/` | Login page |
| `register` | POST | `/api/register/` | Register page |
| `refreshToken` | POST | `/api/token/refresh/` | Auto (interceptor) |
| `uploadAudio` | POST | `/audio-records/` | Dashboard |
| `getAudioRecords` | GET | `/audio-records/` | History page |
| `getAudioRecord` | GET | `/audio-records/:id/` | TranscriptDetail |
| `deleteAudioRecord` | DELETE | `/audio-records/:id/` | History page |
| `generateSummary` | POST | `/api/ai/summary/` | Dashboard + Detail |

### To change an endpoint

Open `src/services/api.js` and edit the path string directly:

```js
// Before
export const generateSummary = (data) => api.post('/api/ai/summary/', data)

// After (if your route changes)
export const generateSummary = (data) => api.post('/api/v2/ai/summary/', data)
```

---

## Auth Flow

1. User logs in → backend returns `{ access, refresh }` JWT tokens
2. Tokens stored in `localStorage`
3. Every API request automatically gets `Authorization: Bearer <access>`
4. On 401, the refresh token is used to get a new access token
5. If refresh fails → user is redirected to `/login`

---

## Design System

Design tokens are in `src/index.css` under `:root`. To change the colour palette, edit:

```css
:root {
  --color-accent: #f59e0b;       /* amber — buttons, tags */
  --color-ink: #1e293b;          /* near-black — headings */
  --color-muted: #6b7280;        /* grey — secondary text */
  --color-bg: #f7f8fa;           /* page background */
  --color-surface: #ffffff;      /* cards */
}
```

Fonts (loaded via Google Fonts in `index.html`):
- **Syne** — headings
- **Inter** — body text
- **JetBrains Mono** — code, badges, meta info

---

## Common Issues

**CORS errors?**
→ Make sure your Django backend has `CORS_ALLOWED_ORIGINS` set to include `http://localhost:5173`.

**401 on every request?**
→ Check that `VITE_API_BASE_URL` doesn't have a trailing slash, and that your Django JWT settings use `Bearer` tokens (SimpleJWT default).

**Audio upload fails?**
→ The upload uses `multipart/form-data`. Make sure Django's `audio-records/` endpoint accepts `audio_file` as the field name.
