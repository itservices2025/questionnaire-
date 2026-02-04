# NETRA Forms by Stoic DNC

A beautiful full-stack questionnaire application with glassmorphism UI design.

![Glass UI](https://img.shields.io/badge/UI-Glassmorphism-blueviolet)
![Docker Hub](https://img.shields.io/badge/Docker%20Hub-Available-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- Beautiful glassmorphism UI design
- Dark/Light mode toggle
- Montserrat font throughout
- 13 question types supported:
  - Short Text, Long Text, Email, Phone, Number
  - Date, Time, Dropdown, Multi-Select
  - Radio Buttons, Checkbox, Star Rating, File Upload
- Admin dashboard for form management
- Drag-and-drop form builder
- Public form submission with unique URLs
- Excel export for responses
- PDF receipt download for submissions
- JWT authentication
- Docker Hub images for easy deployment

---

## Quick Start with Docker

### Option 1: Pull from Docker Hub (Recommended)

```bash
# Create docker-compose.yml
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

### Create Your First Admin Account

1. Open http://localhost:8080
2. Click "Sign up"
3. Enter your name, email, and password
4. Start creating forms!

---

## Docker Images

Available on Docker Hub:

| Image | Pull Command |
|-------|--------------|
| **Client** | `docker pull personaltailscale/netra-forms-client:latest` |
| **Server** | `docker pull personaltailscale/netra-forms-server:latest` |

---

## Docker Commands Reference

### Start the application
```bash
docker compose up -d
```

### Stop the application
```bash
docker compose down
```

### View logs
```bash
# All services
docker compose logs -f

# Server only
docker compose logs -f server

# Client only
docker compose logs -f client
```

### Reset database (delete all data)
```bash
docker compose down -v
docker compose up -d
```

### Check container status
```bash
docker compose ps
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `change-this-secret` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Backend server port | `3001` |

### Changing the Port

To run on a different port, edit `docker-compose.yml`:

```yaml
client:
  ports:
    - "3000:80"  # Change 8080 to your desired port
```

---

## Project Structure

```
netra-forms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Glass UI components + Logo
│   │   │   └── questions/  # 13 question type renderers
│   │   ├── pages/          # Auth, Admin, Public pages
│   │   ├── context/        # AuthContext, ThemeContext
│   │   └── api/            # API client
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth & validation
│   ├── prisma/             # Database schema
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS, Montserrat Font, React Router v6, React Query |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite + Prisma ORM |
| **Export** | ExcelJS (Excel), jsPDF (PDF) |
| **Deployment** | Docker, Nginx, Docker Hub |

---

## Development Setup (Without Docker)

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies
```bash
npm install
```

### Initialize Database
```bash
npm run db:push
```

### Start Development Servers
```bash
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new admin |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Forms (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all forms |
| POST | `/api/forms` | Create form |
| GET | `/api/forms/:id` | Get form details |
| PUT | `/api/forms/:id` | Update form |
| DELETE | `/api/forms/:id` | Delete form |
| PUT | `/api/forms/:id/questions` | Update questions |
| GET | `/api/forms/:id/responses` | Get responses |
| GET | `/api/forms/:id/export` | Export to Excel |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/forms/:slug` | Get form by slug |
| POST | `/api/public/forms/:slug/submit` | Submit response |
| GET | `/api/public/responses/:id` | Get receipt |

---

## Troubleshooting

### Container keeps restarting
```bash
docker compose logs server
```
Check for database or permission errors.

### Port already in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill it or change port in docker-compose.yml
```

### Database issues
```bash
# Reset everything
docker compose down -v
docker compose up -d
```

---

## License

MIT License - feel free to use for personal or commercial projects.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
