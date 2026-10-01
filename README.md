# SkillBridge — Modern Job Portal Platform

A full-stack, feature-packed Job Portal Platform connecting job seekers with hiring companies. Built with a modern React + Vite frontend and a secure Node.js + Express + MongoDB backend.

---

## 🌟 Key Features

### 🔍 For Job Seekers
- **Smart Job Search & Filtering**: Instant keyword search across title, company, and location with multi-facet filters:
  - Job type (Full-time, Part-time, Contract, Internship, Freelance, Remote)
  - Minimum salary filter ($50k+, $75k+, $100k+, $120k+)
  - Bookmarked / Saved jobs filter toggle with live count
- **Interactive Bookmarks**: Save listings to your personal bookmarks with immediate reactive state and Navbar indicators.
- **Application Flow with Cover Notes**: Submit applications directly to listings with optional cover letters and customized introductory notes.
- **Application Tracking Dashboard**: Dedicated `/my-applications` view tracking status (Pending Review, Accepted, Not Selected), date applied, and employer feedback notes.
- **Profile & Security**: Edit bio, location, skills tags, view account roles, and change passwords with instant validation.

### 🏢 For Employers & Admins
- **Rich Job Creation**: Post job openings specifying:
  - Role title, company name, location, and annual compensation
  - Employment type & experience level (Entry Level to Manager)
  - Required skills tag list and application deadlines
  - "Featured Listing" badge for premium visibility
- **Applicant Review Pipeline**: Review candidates who applied, inspect submitted cover letters and seeker profiles, and update status (accept / reject) with internal notes.
- **Portal Analytics**: Real-time stats showing active listings count, location coverage, and average salary benchmarks.

### 🎨 Design & Experience
- **Theme Switcher**: Seamless Dark Mode / Light Mode with localStorage persistence.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Clean UI Tokens**: Curated color schemes, micro-animations, glassmorphism overlays, and clear status badges.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Vanilla CSS design system
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt, Morgan logger, CORS
- **Storage & State**: React Context API, LocalStorage persistence, Custom Events

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (or automatic in-memory fallback for local dev)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/karmaboy1309/job-portal-platform.git
cd job-portal-platform

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### 2. Configure Environment

In `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key
```
*(If no `MONGO_URI` is provided, backend falls back to in-memory MongoDB for local development.)*

### 3. Run Locally

**Start Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Start Frontend Client:**
```bash
cd Frontend
npm run dev
# Client runs on http://localhost:5173
```

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new seeker or employer | Public |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Authenticated |
| `PUT` | `/api/auth/me` | Update profile information | Authenticated |
| `POST` | `/api/auth/change-password` | Update account password | Authenticated |
| `GET` | `/api/auth/user/:id` | View applicant profile details | Authenticated |
| `GET` | `/api/jobs` | Browse active jobs (with search & filters) | Public |
| `GET` | `/api/jobs/stats` | Aggregate portal metrics | Public |
| `GET` | `/api/jobs/:id` | Get single job details | Public |
| `POST` | `/api/jobs/create` | Post a new job listing | Employer / Admin |
| `POST` | `/api/jobs/:id/apply` | Apply to a job listing | Seeker |
| `GET` | `/api/jobs/my-applications` | Get seeker's submitted applications | Seeker |
| `GET` | `/api/jobs/:id/applications` | View applicants for a job | Employer / Admin |
| `PATCH` | `/api/jobs/:id/applications/:appId` | Update application status & notes | Employer / Admin |

---

## 📄 License
ISC
