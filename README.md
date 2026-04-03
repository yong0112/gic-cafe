# Café Employee Manager

A full-stack application for managing cafés and their employees. Built for the GIC Digital Platform internship assessment.

**Live URL:** https://gic-cafe-production.up.railway.app

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- AG Grid v33 (data tables)
- Ant Design v5 (UI components)
- React Hook Form + Zod (form validation)
- TanStack Query (server state management)
- React Router v7

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- tsyringe (dependency injection)
- Zod (request validation)
- Multer (logo uploads)

**Architecture**
- Clean Architecture with CQRS (Commands and Queries as separate classes)
- Mediator pattern for decoupling controllers from handlers
- Repository pattern for data access

## Prerequisites

- Node.js 18+
- PostgreSQL (local installation)
- Docker + Docker Desktop (for Docker setup)

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/yong0112/gic-cafe.git
cd gic-cafe
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your PostgreSQL credentials:
```
DATABASE_URL="postgresql://YOUR_POSTGRES_USERNAME:YOUR_POSTGRES_PASSWORD@localhost:5432/gic_cafe"
PORT=3000
NODE_ENV=development
```

Run migrations and seed:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

Start the backend:
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Docker

Runs the full stack (PostgreSQL + backend + frontend) with a single command. No manual setup required.

```bash
docker compose up --build
```

Access the app at `http://localhost`

To stop:
```bash
docker compose down
```

## Project Structure

```
gic-cafe/
├── backend/
│   ├── prisma/           # Schema, migrations, seed
│   └── src/
│       ├── cafes/        # Café commands, queries, handlers
│       ├── employees/    # Employee commands, queries, handlers
│       ├── controllers/  # HTTP layer
│       ├── repositories/ # Data access layer
│       ├── mediator/     # Mediator implementation
│       ├── middleware/   # Error handler, upload
│       ├── routes/       # Express routers
│       └── schemas/      # Zod validation schemas
├── frontend/
│   └── src/
│       ├── api/          # Axios API calls
│       ├── components/   # Shared components, AG Grid cell renderers
│       ├── hooks/        # TanStack Query hooks
│       ├── pages/        # Cafes and Employees pages + forms
│       └── schemas/      # Zod form schemas
├── docker-compose.yml
└── Dockerfile            # Production build (used by Railway)
```

## Architectural Decisions

### CQRS + Mediator Pattern

Commands and Queries are plain classes (e.g. `CreateCafeCommand`, `GetCafesQuery`). Handlers contain the business logic and are registered with a central `Mediator`. Controllers dispatch requests via `mediator.send(new GetCafesQuery())` without knowing which handler will process them.

This decouples the HTTP layer from business logic and makes each handler independently testable.

> **Note:** CQRS and the Mediator pattern are admittedly overkill for a CRUD app of this scope. In a real project of this size, a straightforward controller → service architecture would be simpler and equally effective. They were applied here intentionally to demonstrate familiarity with the patterns as referenced in the assessment.

### tsyringe for Dependency Injection

Used as the DI container (similar to Autofac in .NET). Dependencies are injected via constructor decorators (`@injectable`, `@inject`). The `PrismaClient` is registered as a singleton and injected into repositories.

### One Café Per Employee

Enforced at the database level via a `CafeEmployee` junction table with a unique constraint on `employeeId`. Deleting a café cascades to its employees through the application layer (not DB cascade) to ensure clean business logic.
