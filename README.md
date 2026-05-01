# Readify

Build unbreakable reading habits through accountability, AI, and precision tracking.

---

## Overview

Readify is an engine-driven reading system designed to transform reading into a structured, measurable, and AI-enhanced habit loop.

Instead of only tracking pages, Readify:

* Tracks real reading sessions
* Enforces daily reading commitments
* Builds book-level streak systems
* Uses AI to summarize reading sessions
* Ensures accurate, derived progress tracking

Think of it as a fitness tracker for reading books.

---

## Problem Statement

Most reading apps:

* Rely on manual page tracking
* Do not enforce consistency
* Do not help users retain what they read
* Fail to build long-term reading habits

As a result, users lose motivation and stop reading over time.

---

## Solution

Readify solves this using four core systems:

### 1. Streak Engine

* Tracks reading per book (not global streaks)
* Uses user timezone for accurate day tracking
* Prevents manipulation across time zones
* Automatically updates after each session

Goal: Build consistent reading discipline.

---

### 2. Reading Session Engine

Reading is treated as a live session:

* Session starts when user begins reading
* Tracks time using heartbeat signals
* Records start and end pages
* Recovers data if browser crashes

Reading becomes a structured activity instead of manual input.

---

### 3. Progress Engine

* Progress is NOT manually updated
* It is derived from all reading sessions
* Ensures consistency and data integrity

This ensures progress cannot be faked or manually manipulated.

---

### 4. AI Summarizer (Google Gemini)

After each session:

* Session data and user notes are sent to AI
* AI generates a short thematic summary
* Helps users retain what they read

Solves the problem of forgetting previously read content.

---

### 5. EPUB / PDF Support

Users can:

* Upload EPUB or PDF files
* Store them in Supabase Storage
* Link files to their reading library

Supports both physical and digital reading formats.

---

## System Architecture

### Frontend

* Next.js 14 (App Router)
* React
* Zustand (UI state only)

### Backend

* Next.js API routes
* Supabase PostgreSQL
* Row Level Security (RLS)

### AI Layer

* Google Gemini API

---

## Event-Driven System Flow

```
User ends reading session
        ↓
SESSION_END event triggered
        ↓
Progress Engine updates progress
Streak Engine updates streak
AI Engine generates summary
```

Key principle:

* If one system fails, others continue working
* Session data is always preserved

---

## User Flow

### 1. Authentication

* User signs up
* Timezone is detected and stored

### 2. Add Book

User can:

* Search via Google Books API
* Add manually
* Upload EPUB/PDF

### 3. Start Reading Session

* Reader mode opens
* Session begins tracking
* Heartbeat ensures continuity

### 4. End Session

* User enters last page
* Session is closed
* System updates all engines

### 5. Dashboard

User sees:

* Reading streaks
* Progress per book
* AI-generated summaries
* Reading history

---

## Key Innovations

* Engine-based architecture (isolated systems)
* Book-level streak tracking
* Real-time reading session monitoring
* AI-powered reading summaries
* Multi-format book support

---

## Reliability Principles

* Supabase is the single source of truth
* All progress is derived from sessions
* AI failures do not affect core system
* Sessions are recoverable after crashes
* Timezone-safe streak logic

---

## Tech Stack

* Next.js 14
* Supabase (Auth, Database, Storage)
* PostgreSQL + RLS
* Google Gemini API
* Zustand
* Custom CSS design system

---

## Design Philosophy

Readify is designed with one principle:

UI is behavior, not decoration.

* Minimal design
* Dark mode first
* Smooth micro-interactions
* Focus-driven reading experience

---

## Final Vision

Readify transforms reading into a structured, measurable, and intelligent habit system.

It ensures users:

* Read consistently
* Retain more information
* Build long-term discipline

---

## One-line Summary

Readify turns reading into a measurable habit system powered by structured sessions, streak logic, and AI-driven insights.
