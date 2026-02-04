# Glass Questionnaire

A beautiful full-stack questionnaire application with glassmorphism UI.

## Features

- Beautiful glassmorphism UI design
- 13 question types (text, email, phone, number, date, time, select, multiselect, radio, checkbox, rating, file, textarea)
- Admin dashboard for form management
- Drag-and-drop form builder
- Public form submission
- Excel export for responses
- PDF receipt download
- JWT authentication

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Run the Application

1. Clone the repository and navigate to the project directory:
```bash
cd glass-questionnaire
```

2. (Optional) Create a `.env` file for custom configuration:
```bash
cp .env.example .env
# Edit .env to set your JWT_SECRET
```

3. Build and start the containers:
```bash
docker-compose up -d --build
```

4. Access the application:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api

### Stop the Application
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Reset Data
```bash
docker-compose down -v  # This removes the database volume
docker-compose up -d --build
```

## Development Setup

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

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + React Router v6 + React Query
- **Backend**: Node.js + Express.js
- **Database**: SQLite + Prisma ORM
- **Export**: ExcelJS (Excel) + jsPDF (PDF receipts)

## Project Structure

```
glass-questionnaire/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── api/           # API client
│   └── Dockerfile
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Express middleware
│   ├── prisma/            # Database schema
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## License

MIT
