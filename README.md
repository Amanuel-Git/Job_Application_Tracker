# Student Job Application Tracker

A simple React application built with Vite for students to track job applications, interview progress, and notes.

## Purpose

This project is designed to help students manage their job application workflow by storing:

- company name
- applied role
- application status (`Applied`, `Interview`, `Rejected`,'accepted')
- recruiter / follow-up notes

Recent updates added a fully interactive tracker UI with local persistence, status filtering, and editable notes for each application.

## Technology stack

- React 19
- Vite 4+ for development and build tooling
- ESLint for code quality
- Supabase for database storage and persistence

## Features

- Add new job applications with company, role, status, and notes
- Filter applications by status or view all
- Edit notes for each saved application
- Change application status after submission
- Remove applications
- Persist data in Supabase database for cross-device access

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Supabase Configuration

This app uses Supabase for database storage. The connection is set up in `src/supabaseClient.js` using the provided Supabase URL and anon key. Data is stored in a Supabase database for persistence across sessions and devices.

## Project structure

- `src/App.jsx` — main tracker application logic
- `src/App.css` — tracker styling
- `src/main.jsx` — application entry point
- `package.json` — dependencies and scripts

## Notes

This project uses client-side storage only, so all data is saved in the browser and is not shared between devices.
