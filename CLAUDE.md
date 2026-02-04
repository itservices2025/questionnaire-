# Glass Questionnaire

A full-stack questionnaire/form builder app with glassmorphism UI design.

## Tech Stack

### Frontend (client/)
- React 18 + Vite
- TailwindCSS (glassmorphism theme)
- React Router v6
- TanStack React Query
- @dnd-kit for drag-and-drop
- Axios for API calls
- react-hot-toast for notifications
- jsPDF for PDF generation

### Backend (server/)
- Node.js + Express.js
- Prisma ORM with SQLite
- JWT authentication (jsonwebtoken)
- bcryptjs for password hashing
- express-validator for validation
- ExcelJS for Excel exports

## Project Structure

```
glass-questionnaire/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── ui/            # Glass UI components (GlassCard, GlassButton, etc.)
│       │   └── questions/     # 13 question type renderers
│       ├── pages/
│       │   ├── auth/          # Login, Register
│       │   ├── admin/         # Dashboard, FormBuilder, FormResponses
│       │   └── public/        # FormView, ThankYou
│       ├── context/           # AuthContext
│       └── api/               # Axios client
├── server/                    # Express backend
│   └── src/
│       ├── routes/            # auth, forms, public routes
│       ├── middleware/        # auth, validate middleware
│       └── index.js           # Entry point
│   └── prisma/
│       └── schema.prisma      # Database schema
└── docker-compose.yml
```

## Commands

```bash
# Development (runs both client & server)
npm run dev

# Client only (port 5173)
npm run dev:client

# Server only (port 3001)
npm run dev:server

# Build client
npm run build

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio GUI

# Docker
docker compose up -d --build    # Start all services
docker compose down             # Stop all services
docker compose logs -f          # View logs
```

## Database Models

- **Admin** - User accounts (email, password, name)
- **Form** - Forms with title, description, slug, isActive
- **Question** - 13 types: text, textarea, email, phone, number, date, time, select, multiselect, radio, checkbox, rating, file
- **Response** - Form submissions with metadata
- **Answer** - Individual answers linked to questions and responses

## Conventions

### Code Style
- ES Modules (`type: "module"` in package.json)
- Functional React components with hooks
- API client uses Axios with interceptors for auth tokens
- All Glass UI components follow naming pattern: `Glass[Component].jsx`

### API Routes
- Protected routes use JWT auth middleware
- Validation uses express-validator
- All API routes prefixed with `/api/`

### Question Types
Question components in `client/src/components/questions/` follow pattern:
- `[Type]Question.jsx` - Individual question renderer
- `QuestionRenderer.jsx` - Factory component that selects correct renderer

### State Management
- Auth state via React Context (`AuthContext`)
- Server state via TanStack Query
- Form builder state is local component state

## Environment Variables

```bash
# Server
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
```

## Ports

| Service | Development | Docker |
|---------|-------------|--------|
| Frontend | 5173 | 8080 |
| Backend | 3001 | 3001 (internal) |

## Important Patterns

1. **Glass UI Theme**: All UI components use backdrop blur and semi-transparent backgrounds
2. **Question Options**: Stored as JSON strings in database, parsed on read
3. **Form Slugs**: Auto-generated unique identifiers for public form URLs
4. **File Uploads**: Handled via FileQuestion component (base64 or blob)
5. **Drag & Drop**: Uses @dnd-kit for reordering questions in FormBuilder
