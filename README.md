# NETRA Forms by Stoic DNC

A full-stack form builder with glassmorphism UI, OTP-based two-factor authentication, Cloudflare R2 file storage, and automated email notifications.

![Glass UI](https://img.shields.io/badge/UI-Glassmorphism-blueviolet)
![Docker Hub](https://img.shields.io/badge/Docker%20Hub-Available-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [SMTP Setup (Email & 2FA)](#smtp-setup-email--2fa)
- [Cloudflare R2 Setup (File Storage)](#cloudflare-r2-setup-file-storage)
- [How OTP 2FA Works](#how-otp-2fa-works)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Question Types](#question-types)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Glassmorphism UI with dark/light mode toggle
- Montserrat font throughout
- OTP-based two-factor authentication (email verification on login & register)
- 15 question types including Name, Phone (with country code selector), File Upload
- Drag-and-drop form builder
- Cloudflare R2 presigned URL file uploads (50MB max)
- Submission confirmation emails to both admin and respondent
- Public form URLs via unique slugs
- Excel export for responses
- PDF receipt download
- Docker Hub images for one-command deployment

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6, TanStack React Query |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | SQLite |
| **Auth** | JWT + OTP 2FA (via email) |
| **Email** | Nodemailer (any SMTP provider) |
| **File Storage** | Cloudflare R2 (S3-compatible) |
| **Export** | ExcelJS (Excel), jsPDF (PDF) |
| **Deployment** | Docker, Nginx, Docker Hub |

---

## Prerequisites

### For Docker deployment
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### For local development
- **Node.js** 18 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)

Verify your installation:

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version
```

---

## Quick Start with Docker

### Option 1: Pull from Docker Hub (Recommended)

```bash
# Download the compose file
curl -O https://raw.githubusercontent.com/itservices2025/questionnaire-/main/docker-compose.yml

# Start the application
docker compose up -d
```

### Option 2: Clone and Run

```bash
git clone https://github.com/itservices2025/questionnaire-.git
cd questionnaire-
docker compose up -d
```

### Access the Application

| Service | URL |
|---------|-----|
| **Web App** | http://localhost:8080 |
| **API Health** | http://localhost:8080/api/health |

> In Docker mode without SMTP configured, OTP codes are printed to server logs. View them with `docker compose logs -f server`.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/itservices2025/questionnaire-.git
cd questionnaire-
```

### 2. Install all dependencies

This is a monorepo with npm workspaces. One install command handles both client and server:

```bash
npm install
```

This installs:

**Root:**
- `concurrently` — runs client + server simultaneously

**Server (`server/`):**
- `express` — web framework
- `@prisma/client` + `prisma` — ORM and database toolkit
- `jsonwebtoken` — JWT authentication
- `bcryptjs` — password hashing
- `express-validator` — request validation
- `nodemailer` — SMTP email sending (OTP + submission emails)
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — Cloudflare R2 file uploads
- `exceljs` — Excel export
- `cors` — cross-origin requests
- `dotenv` — environment variable loading
- `nodemon` (dev) — auto-restart on file changes

**Client (`client/`):**
- `react` + `react-dom` — UI framework
- `react-router-dom` — routing
- `@tanstack/react-query` — server state management
- `axios` — HTTP client
- `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` — drag-and-drop
- `react-hot-toast` — toast notifications
- `react-icons` — icon library
- `jspdf` — PDF generation
- `vite` (dev) — build tool
- `tailwindcss` + `autoprefixer` + `postcss` (dev) — CSS framework

### 3. Set up environment variables

Create the server `.env` file:

```bash
cp server/.env.example server/.env
```

Or create it manually:

```bash
cat > server/.env << 'EOF'
# Required
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-this"
PORT=3001
NODE_ENV=development

# SMTP (optional in dev — OTP codes log to console if not set)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Cloudflare R2 (optional — file uploads disabled if not set)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
EOF
```

### 4. Initialize the database

```bash
npm run db:push
```

This creates the SQLite database file at `server/dev.db` and applies the Prisma schema.

### 5. Start the development servers

```bash
npm run dev
```

This starts both servers concurrently:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:3001 |

### 6. Create your first admin account

1. Open http://localhost:5173
2. Click **Sign up**
3. Enter your name, email, and password
4. If SMTP is not configured, the OTP code appears in the terminal:
   ```
   [DEV OTP] your@email.com: 247913
   ```
5. Enter the 6-digit code to complete registration

---

## Environment Variables

### All Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` | SQLite database path |
| `JWT_SECRET` | Yes | — | Secret key for signing JWT tokens. **Change in production.** |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Set to `production` for Docker |
| `SMTP_HOST` | No | — | SMTP server hostname (enables email features) |
| `SMTP_PORT` | No | `587` | SMTP server port (`587` for TLS, `465` for SSL) |
| `SMTP_USER` | No | — | SMTP username / email |
| `SMTP_PASS` | No | — | SMTP password or app password |
| `SMTP_FROM` | No | `SMTP_USER` | "From" address on outgoing emails |
| `R2_ACCOUNT_ID` | No | — | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | No | — | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | No | — | R2 API token secret key |
| `R2_BUCKET_NAME` | No | — | R2 bucket name |

> **Dev mode behavior:** When `SMTP_HOST` is not set, OTP codes and email notifications are logged to the console instead of being sent. When R2 credentials are not set, the presigned upload endpoint returns an error (file uploads won't work without R2).

---

## SMTP Setup (Email & 2FA)

SMTP is required for:
- **OTP verification codes** on login and registration (2FA)
- **Submission confirmation emails** sent to admin and respondent after form submission

Without SMTP configured, the app still works — OTP codes are printed to the server console, and submission emails are skipped.

### Option A: Gmail SMTP

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** on your Google account
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and generate a password
5. Set these environment variables:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx    # The 16-char app password (no spaces)
SMTP_FROM=your-email@gmail.com
```

### Option B: Outlook / Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### Option C: Amazon SES

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=YOUR_SES_SMTP_USERNAME
SMTP_PASS=YOUR_SES_SMTP_PASSWORD
SMTP_FROM=verified-sender@yourdomain.com
```

### Option D: Any SMTP Provider

Any standard SMTP service works (SendGrid, Mailgun, Zoho, Brevo, etc.). Just fill in the five SMTP variables with your provider's credentials.

### Docker: Pass SMTP via environment

```bash
SMTP_HOST=smtp.gmail.com \
SMTP_PORT=587 \
SMTP_USER=you@gmail.com \
SMTP_PASS=xxxx-xxxx-xxxx-xxxx \
SMTP_FROM=you@gmail.com \
docker compose up -d
```

Or create a `.env` file next to `docker-compose.yml`:

```bash
cat > .env << 'EOF'
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
SMTP_FROM=you@gmail.com
EOF
```

Then run `docker compose up -d` — Docker Compose automatically reads `.env`.

### Emails sent by the app

| When | To | Subject |
|------|----|---------|
| Admin registers | Admin email | NETRA Forms - Verification Code |
| Admin logs in | Admin email | NETRA Forms - Verification Code |
| Form is submitted | Admin email | New response: {Form Title} |
| Form is submitted | Respondent email* | Your submission to {Form Title} |

*Respondent email is only sent if the form has an email-type question and the respondent filled it in.

---

## Cloudflare R2 Setup (File Storage)

R2 is Cloudflare's S3-compatible object storage. It's used for file upload questions — files are uploaded directly from the browser to R2 using presigned URLs (never passing through your server).

### Why R2?

- Files don't bloat your SQLite database (previously stored as base64)
- Direct browser-to-R2 upload with progress bar
- 50MB file size limit
- Presigned URLs expire (15 min for upload, 1 hour for download)

### Step 1: Create a Cloudflare account

Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/) (free tier includes 10GB R2 storage).

### Step 2: Create an R2 bucket

1. In the Cloudflare dashboard, go to **R2 Object Storage**
2. Click **Create bucket**
3. Name it (e.g., `netra-forms-uploads`)
4. Choose your preferred location
5. Click **Create bucket**

### Step 3: Create an API token

1. In R2, go to **Manage R2 API Tokens** (or **Overview > Manage API Tokens**)
2. Click **Create API token**
3. Set permissions to **Object Read & Write**
4. Scope it to your bucket (e.g., `netra-forms-uploads`)
5. Click **Create API Token**
6. Copy the **Access Key ID** and **Secret Access Key** (shown only once)

### Step 4: Find your Account ID

Your Account ID is in the Cloudflare dashboard URL:
```
https://dash.cloudflare.com/ACCOUNT_ID_HERE/...
```
Or find it on the R2 overview page.

### Step 5: Configure CORS on the bucket

Your bucket needs CORS rules to allow browser uploads. In the R2 bucket settings, add this CORS policy:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

> For production, replace `"*"` in `AllowedOrigins` with your actual domain (e.g., `"https://forms.yourdomain.com"`).

### Step 6: Set environment variables

```bash
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=netra-forms-uploads
```

### Allowed file types

The server whitelists these file types for upload:
- **Images:** JPEG, PNG, GIF, WebP
- **Documents:** PDF, DOCX, XLSX, TXT, CSV

### Without R2 configured

If R2 credentials are not set, file-type questions will show an upload error when respondents try to attach files. All other question types work normally.

---

## How OTP 2FA Works

NETRA Forms uses email-based OTP (One-Time Password) for two-factor authentication on both registration and login.

### Flow

```
Register / Login
      |
      v
Enter email + password
      |
      v
Server validates credentials
      |
      v
6-digit OTP sent to email  ──>  (or logged to console in dev mode)
      |
      v
Enter OTP in the app
      |
      v
Server verifies OTP
      |
      v
JWT token issued, user authenticated
```

### Security details

- **6-digit numeric code** generated per attempt
- **10-minute expiry** — code becomes invalid after 10 minutes
- **5 attempt limit** — after 5 wrong guesses the pending session is locked
- **Resend** — users can request a new code (replaces the previous one)
- **In-memory store** — pending OTP sessions are stored in server memory (cleared on restart)
- **Auto-cleanup** — expired sessions are purged every 5 minutes

### Dev mode (no SMTP)

When `SMTP_HOST` is not configured, OTP codes appear in the server terminal:

```
[DEV OTP] admin@example.com: 384729
```

Just copy the code from the terminal into the OTP input on the web page.

---

## Project Structure

```
netra-forms/
├── client/                          # React frontend
│   └── src/
│       ├── api/
│       │   └── client.js            # Axios instance with auth interceptor
│       ├── components/
│       │   ├── ui/                   # GlassButton, GlassInput, Logo, etc.
│       │   └── questions/            # Question type renderers
│       │       ├── QuestionRenderer.jsx   # Factory — picks correct renderer
│       │       ├── TextQuestion.jsx
│       │       ├── TextareaQuestion.jsx
│       │       ├── EmailQuestion.jsx
│       │       ├── PhoneQuestion.jsx      # Country code selector + number
│       │       ├── NameQuestion.jsx       # First name + last name
│       │       ├── NumberQuestion.jsx
│       │       ├── DateQuestion.jsx
│       │       ├── TimeQuestion.jsx
│       │       ├── SelectQuestion.jsx
│       │       ├── MultiSelectQuestion.jsx
│       │       ├── RadioQuestion.jsx
│       │       ├── CheckboxQuestion.jsx
│       │       ├── RatingQuestion.jsx
│       │       └── FileQuestion.jsx       # R2 presigned URL upload
│       ├── context/
│       │   ├── AuthContext.jsx       # Auth state + OTP verify methods
│       │   └── ThemeContext.jsx      # Dark/light mode
│       └── pages/
│           ├── auth/
│           │   ├── Login.jsx         # 2-step: credentials -> OTP
│           │   └── Register.jsx      # 2-step: credentials -> OTP
│           ├── admin/
│           │   ├── Dashboard.jsx
│           │   ├── FormBuilder.jsx
│           │   └── FormResponses.jsx
│           └── public/
│               ├── FormView.jsx
│               └── ThankYou.jsx
├── server/                           # Express backend
│   ├── prisma/
│   │   └── schema.prisma            # Database models
│   └── src/
│       ├── index.js                  # Entry point, route registration
│       ├── middleware/
│       │   ├── auth.js               # JWT verification middleware
│       │   └── validate.js           # express-validator middleware
│       ├── routes/
│       │   ├── auth.js               # Register, login, OTP verify, resend
│       │   ├── forms.js              # CRUD forms, questions, responses, export
│       │   ├── public.js             # Public form view, submit, receipt
│       │   └── upload.js             # Presigned URL generation for R2
│       └── services/
│           ├── otp.js                # In-memory OTP store + generation
│           ├── email.js              # Nodemailer transporter + email templates
│           └── r2.js                 # S3Client for R2 presigned URLs
├── docker-compose.yml
├── package.json                      # Root workspace config
└── README.md
```

---

## Database Schema

The app uses SQLite via Prisma ORM with 5 models:

| Model | Purpose |
|-------|---------|
| **Admin** | User accounts (email, hashed password, name) |
| **Form** | Forms with title, description, unique slug, active status |
| **Question** | 15 types, with label, options (JSON), validation rules, ordering |
| **Response** | Form submissions with timestamp and metadata (IP, user agent) |
| **Answer** | Individual answer values (stored as JSON strings) |

### Useful database commands

```bash
# Push schema changes to database
npm run db:push

# Regenerate Prisma client after schema changes
npm run db:generate

# Open Prisma Studio (visual database browser)
npm run db:studio
```

Prisma Studio opens at http://localhost:5555 and lets you browse/edit all records.

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Start registration (returns `pendingId`) |
| POST | `/api/auth/verify-register` | Verify OTP to complete registration |
| POST | `/api/auth/login` | Start login (returns `pendingId`) |
| POST | `/api/auth/verify-login` | Verify OTP to complete login |
| POST | `/api/auth/resend-otp` | Resend OTP for a pending session |
| GET | `/api/auth/me` | Get current authenticated admin |

### Forms (Protected — requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all forms |
| POST | `/api/forms` | Create a new form |
| GET | `/api/forms/:id` | Get form with questions |
| PUT | `/api/forms/:id` | Update form title/description/status |
| DELETE | `/api/forms/:id` | Delete form and all its data |
| PUT | `/api/forms/:id/questions` | Bulk save questions |
| GET | `/api/forms/:id/responses` | Get all responses with answers |
| GET | `/api/forms/:id/export` | Download responses as Excel file |

### File Upload (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/presign` | Get presigned R2 upload URL |

### Public (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/forms/:slug` | Get form by public slug |
| POST | `/api/public/forms/:slug/submit` | Submit a form response |
| GET | `/api/public/responses/:id` | Get submission receipt |

---

## Question Types

| Type | Component | Stored Value |
|------|-----------|-------------|
| Short Text | `TextQuestion` | `"string"` |
| Long Text | `TextareaQuestion` | `"string"` |
| Email | `EmailQuestion` | `"email@example.com"` |
| Phone Number | `PhoneQuestion` | `{"countryCode":"+91","country":"India","flag":"...","number":"9876543210"}` |
| Name | `NameQuestion` | `{"firstName":"John","lastName":"Doe"}` |
| Number | `NumberQuestion` | `42` |
| Date | `DateQuestion` | `"2026-02-07"` |
| Time | `TimeQuestion` | `"14:30"` |
| Dropdown | `SelectQuestion` | `"selected option"` |
| Multi-Select | `MultiSelectQuestion` | `["option1","option2"]` |
| Radio | `RadioQuestion` | `"selected option"` |
| Checkbox | `CheckboxQuestion` | `true` / `false` |
| Star Rating | `RatingQuestion` | `4` |
| File Upload | `FileQuestion` | `{"fileKey":"uploads/uuid/file.pdf","fileName":"file.pdf","fileType":"application/pdf","fileSize":12345}` |

---

## Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs (all services)
docker compose logs -f

# View server logs only (useful for OTP codes in dev)
docker compose logs -f server

# Check container status
docker compose ps

# Reset database (deletes all data)
docker compose down -v
docker compose up -d

# Rebuild after code changes
docker compose up -d --build
```

### Changing the port

Edit `docker-compose.yml` to map a different host port:

```yaml
client:
  ports:
    - "3000:80"   # Change 8080 to 3000
```

---

## Troubleshooting

### OTP code not arriving via email

1. Check that all 5 SMTP variables are set correctly
2. For Gmail, ensure you're using an **App Password** (not your regular password)
3. Check server logs for SMTP errors: `docker compose logs -f server` or check terminal in dev
4. Without SMTP configured, codes appear in the console — this is expected in development

### "File upload failed" error

1. R2 credentials must be configured for file uploads to work
2. Check that your R2 bucket has the correct CORS policy
3. File must be under 50MB and an allowed type (images, PDF, DOCX, XLSX, TXT, CSV)

### Container keeps restarting

```bash
docker compose logs server
```
Check for database or environment variable errors.

### Port already in use

```bash
# Find process using the port
lsof -i :8080

# Kill it or change port in docker-compose.yml
```

### Database issues

```bash
# In development — delete and recreate
rm server/dev.db
npm run db:push

# In Docker — reset volume
docker compose down -v
docker compose up -d
```

### Prisma client out of sync

If you see Prisma errors after pulling new code:

```bash
npm run db:generate
npm run db:push
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — feel free to use for personal or commercial projects.
