# Task Manager

A full-stack Task Manager for the Web Application Development Tools final project.

The project is based on **Variant 10 – ToDo Application**, but was extended with additional functionality.

## Current stack

- Next.js App Router, React and TypeScript
- MongoDB Atlas with the native MongoDB driver
- Server-side registration, login, logout and MongoDB sessions
- Local task UI with light/dark themes, search, filters and sorting
- CSS in `app/globals.css`

## Technologies

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `MONGODB_URI` and `MONGODB_DB` in `.env.local`. Keep `.env.local` out of Git.
Atlas setup is documented in [docs/mongodb-setup.md](docs/mongodb-setup.md).

Open `http://localhost:3000`. Unauthenticated visitors are sent to `/login`.
Registration is available at `/register`.

## Verification

```bash
npm run lint
npm run test:registration
npm run build -- --webpack
```

## Structure

- `app/` — pages and API route handlers
- `components/` — interactive task and authentication UI
- `lib/` — MongoDB, password and session services
- `types/` — shared TypeScript models
- `docs/` — setup and API notes

Task persistence is still local-first. Moving tasks and categories to MongoDB is
the next backend phase.
