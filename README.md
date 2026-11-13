# Project LOOP — AI-Powered Customer Feedback Intelligence Platform

Project LOOP is a full-stack AI application for collecting customer feedback, storing it through REST APIs, and converting feedback into actionable insights using an LLM.

## Architecture

React + JavaScript → Node.js + Express REST API → MongoDB
                                      ↓
                               AI Analysis Service
                                      ↓
                         Sentiment / Category / Summary /
                         Priority / Recommended Action

## Tech Stack

- Frontend: React.js, JavaScript, CSS, Vite
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT
- AI: Google Gemini API
- API testing: Postman
- Version control: Git/GitHub

## Features

- JWT authentication
- Customer feedback CRUD
- AI analysis of individual feedback
- Sentiment classification
- Category detection
- Priority detection
- AI-generated summary
- Recommended action
- Dashboard analytics
- Search and filtering
- Clean REST API structure

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set these values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project_loop
JWT_SECRET=replace_with_a_long_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:5000/api`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/feedback` | Create feedback |
| GET | `/api/feedback` | List feedback |
| GET | `/api/feedback/:id` | Get feedback |
| PUT | `/api/feedback/:id` | Update feedback |
| DELETE | `/api/feedback/:id` | Delete feedback |
| POST | `/api/feedback/:id/analyze` | AI analysis |
| GET | `/api/analytics/overview` | Dashboard metrics |

## GitHub

Do not commit `.env` or API keys.

```bash
git init
git add .
git commit -m "Initial Project LOOP full-stack AI platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
