# SkillBridge — Modern Job Portal Platform

A full-stack, feature-packed Job Portal Platform connecting job seekers with hiring companies. Built with a modern React + Vite frontend and a secure Node.js + Express + MongoDB backend.

---

## 🌟 Key Features

### 🔍 For Job Seekers
- **Smart Job Search & Multi-Facet Filtering**: Instant keyword search across title, company, and location with comprehensive filters:
  - **Work Mode**: On-site, Remote, Hybrid
  - **Categories**: Engineering, Design, Product, Marketing, Sales, Customer Support, Other
  - **Job Type**: Full-time, Part-time, Contract, Internship, Freelance
  - **Salary Range**: $50k+, $75k+, $100k+, $120k+
  - **Sorting**: Newest First, Salary: High to Low, Salary: Low to High, Application Deadline
- **Pagination**: Smooth numbered pagination controls for easy browsing of extensive listings.
- **Dedicated Saved Jobs Hub**: Dedicated `/saved-jobs` page to view and manage bookmarked roles.
- **Application Flow with Resume & Portfolio**: Submit applications with customized cover notes, direct resume links, and GitHub/portfolio URLs.
- **Application Tracking & Withdrawal**: Dedicated `/my-applications` view tracking status (Pending Review, Accepted, Not Selected), date applied, employer feedback, and ability to withdraw pending applications.
- **Similar Job Recommendations**: Contextual role recommendations on job details pages based on matched categories and skills.
- **Profile & Socials**: Manage profile bio, location, skills tags, LinkedIn, GitHub, and portfolio links.

### 🏢 For Employers & Admins
- **Rich Job Creation**: Post job openings specifying:
  - Role title, company name, location, and annual compensation
  - Work mode (Remote, Hybrid, On-site) and category classification
  - Employment type & experience level (Entry Level to Manager)
  - Required skills tag list and application deadlines
  - "Featured Listing" badge for premium visual highlight
- **Employer Job Dashboard**: Access `/employer/my-jobs` with live applicant count metrics and ability to toggle listings between active and paused.
- **Applicant Review Pipeline**: Review candidates who applied, inspect submitted cover letters and seeker profiles, and update status (accept / reject) with internal notes.
- **Portal Analytics**: Real-time stats showing active listings count, location coverage, and average salary benchmarks.

### 🎨 Design & Experience
- **Vector Icon Library**: Crisp, custom SVG icons for seamless rendering across all platforms and operating systems.
- **Non-Blocking Toast Notifications**: Elegant, animated toast messages for user feedback (success, error, info) with auto-dismissal.
- **Accessible Modal Dialogs**: Custom `ConfirmModal` for deletion and destructive confirmations with backdrop blur and ESC keyboard support.
- **Theme Switcher**: Seamless Dark Mode / Light Mode with localStorage persistence.
- **Responsive Layout**: Fluid layout optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v7, Axios, Context API (Auth & Toast), Modern CSS Design Tokens
- **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt, Morgan logger, CORS, Centralized Error Handling
- **Storage & State**: React Context API, LocalStorage persistence, Custom Window Events

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
*(If no `MONGO_URI` is provided, backend automatically falls back to in-memory MongoDB for local development.)*

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
| `PUT` | `/api/auth/me` | Update profile information & social links | Authenticated |
| `POST` | `/api/auth/change-password` | Update account password | Authenticated |
| `GET` | `/api/auth/user/:id` | View applicant profile details | Authenticated |
| `GET` | `/api/jobs` | Browse jobs with search, category, workMode, sorting & pagination | Public |
| `GET` | `/api/jobs/stats` | Aggregate portal metrics | Public |
| `GET` | `/api/jobs/employer/my-jobs` | List employer's posted jobs with applicant counts | Employer / Admin |
| `PATCH` | `/api/jobs/:id/toggle-status` | Toggle job active/paused listing status | Employer / Admin |
| `GET` | `/api/jobs/:id` | Get single job details | Public |
| `POST` | `/api/jobs/create` | Post a new job listing | Employer / Admin |
| `POST` | `/api/jobs/:id/apply` | Apply to job with cover note, resume & portfolio | Seeker |
| `DELETE` | `/api/jobs/applications/:id` | Withdraw a submitted job application | Seeker |
| `GET` | `/api/jobs/my-applications` | Get seeker's submitted applications | Seeker |
| `GET` | `/api/jobs/:id/applications` | View applicants for a job | Employer / Admin |
| `PATCH` | `/api/jobs/:id/applications/:appId` | Update application status & notes | Employer / Admin |
| `GET` | `/api/health` | Health-check endpoint (uptime + DB state) | Public |

---

## 📄 License
ISC
