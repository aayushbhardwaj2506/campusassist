# CampusAssist

Campus service-request platform. Version 1 implements the **Parcel Pickup**
module on a modular architecture designed so future modules (Food Pickup,
Library Help, Lost & Found, Document Collection, Medicine Pickup) can be
added without refactoring core infrastructure.

## Status

**Phase 1 complete:** project scaffolding, Tailwind, ESLint/Prettier, and
Firebase SDK wiring. No authentication or feature UI yet — see
`docs/architecture/roadmap.md` for the full phase plan.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark-mode-first design system)
- Firebase (Auth, Firestore, Storage, Functions, Hosting)
- ESLint + Prettier

## Project structure

```
campusassist/
├── apps/web/          # React frontend
├── functions/         # Firebase Cloud Functions
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── firebase.json
└── docs/
```

## Getting started

### 1. Install dependencies

```bash
cd apps/web
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# then fill in your Firebase project's config values
```

A `.env.local` with placeholder demo values is already present so the app
boots locally without a real Firebase project attached — replace it with
real values once you provision a Firebase project (Phase 1 task, done via
Firebase Console, not by this repo).

### 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`. You should see a "Firebase SDK initialized"
confirmation on screen.

### 4. Lint & format

```bash
npm run lint
npm run format
```

## Firebase CLI (optional, for emulators/deploy)

```bash
npm install -g firebase-tools
firebase login
firebase use dev
firebase emulators:start
```

## Documentation

Full requirements, architecture, database design, UI/UX spec, and the
phase-by-phase implementation roadmap live in `docs/architecture/`.
