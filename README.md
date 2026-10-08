# Lawyer–Client Management Portal

A full-stack web application that streamlines how a law office works with its clients. Lawyers manage clients, cases and reminders from one dashboard; clients log in to follow their own cases and receive reminders **in real time**.

**Author:** Ameni Belhaj Salem · Projet de Fin d'Année (PFA)
**Project page:** [amenibelhaj.github.io/maitre-belhajsalem-portal](https://amenibelhaj.github.io/maitre-belhajsalem-portal/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?logo=socketdotio)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker&logoColor=white)

---

## Features

**For lawyers**
- Create and manage client accounts — the app generates each client's login credentials
- Create, edit and delete cases linked to a client
- Send reminders and document requests that appear instantly on the client's dashboard (Socket.IO)

**For clients**
- Secure login to a personal dashboard
- View only their own cases and their status
- Receive the lawyer's reminders in real time
- Upload the documents the lawyer requested

**Security**
- Passwords hashed with bcrypt
- JWT authentication on every protected API route and on the WebSocket connection
- Role-based access: lawyers and clients see different data

## Architecture

```
React (Vite + Tailwind)  ──REST / JWT──►  Express API  ──Sequelize──►  PostgreSQL
        ▲                                     │
        └────────── Socket.IO (reminders) ────┘
```

Each user joins a private Socket.IO room after the server verifies their JWT, so reminders are pushed only to the client they are addressed to.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| Backend | Node.js, Express 5, Sequelize ORM, JWT, bcrypt, Multer, Socket.IO |
| Database | PostgreSQL 15 |
| DevOps | Docker, Docker Compose |

## Project structure

```
frontend/                 React app (login, lawyer dashboard, client dashboard)
lawyer-client-backend/
  src/
    controllers/          auth, cases, clients, reminders
    models/               User, Client, Case, Reminder (Sequelize)
    middlewares/          JWT auth, file uploads
    routes/               REST routes
    server.js             HTTP + Socket.IO server
landing-page/             Project presentation page (GitHub Pages)
docker-compose.yml        Database + backend + frontend
```

## Getting started

### With Docker (recommended)

1. Create a `.env` file at the project root (see `lawyer-client-backend/.env.example`).
2. Start everything:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

### Without Docker

```bash
# Backend
cd lawyer-client-backend
cp .env.example .env      # fill in your PostgreSQL settings and a JWT secret
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL host (`db` when using Docker Compose) |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASS` | Database password |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `PORT` | API port (default `5000`) |

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a lawyer |
| POST | `/api/auth/login` | Log in (lawyer or client) |
| GET / POST | `/api/clients` | List or create clients |
| GET | `/api/clients/me/cases` | A client's own cases |
| GET | `/api/clients/me/reminders` | A client's own reminders |
| GET / POST | `/api/cases` | List or create cases |
| GET / PUT / DELETE | `/api/cases/:id` | Read, update or delete a case |
| GET / POST | `/api/reminders` | List or create reminders |
| PUT / DELETE | `/api/reminders/:id` | Update or delete a reminder |
| POST | `/api/reminders/:id/upload` | Client uploads a requested document |

All routes except register and login require a `Authorization: Bearer <token>` header.
