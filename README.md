# 👑 Job Portal Platform — MERN Stack

<div align="center">

![MERN](https://img.shields.io/badge/Stack-MERN-3C873A?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-blue?style=for-the-badge)

**A full-stack job portal platform that connects talent with opportunity.**  
Built for real-world hiring flow with clean UI, secure auth, and scalable backend architecture.

</div>

---

## ✨ What is this project?

**Job Portal Platform** is a modern web application where:

- 👨‍💼 **Recruiters** can post and manage jobs
- 🧑‍💻 **Candidates** can explore opportunities and apply
- 🔐 Secure authentication keeps user data protected
- 📱 Responsive design ensures smooth experience across devices

This project is built using the **MERN stack** and follows practical full-stack patterns for production-style apps.

---

## 🔥 Highlight Features

- ✅ Role-based authentication (Candidate / Recruiter)
- ✅ Job posting and job management workflow
- ✅ Browse and search jobs with clean UI
- ✅ Apply to jobs and track activity
- ✅ Candidate profile handling
- ✅ Protected routes and authorization middleware
- ✅ REST API architecture with modular folders
- ✅ MongoDB persistence with Mongoose models
- ✅ Production-friendly environment configuration

---

## 🧱 Tech Stack

### Frontend
- React.js
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Hashing

### Dev Tools
- Git + GitHub
- npm
- dotenv
- nodemon

---

## 📂 Project Structure (Typical)

```bash
job-portal-platform/
├── client/                  # React frontend
│   ├── public/
│   └── src/
├── server/                  # Node + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── .env
├── package.json
└── README.md
```

> Folder names may differ slightly depending on your current implementation.

---

## 🚀 Getting Started

### 1) Clone repository
```bash
git clone https://github.com/karmaboy1309/job-portal-platform.git
cd job-portal-platform
```

### 2) Install dependencies

If frontend/backend are separate:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

If monorepo single root:
```bash
npm install
```

### 3) Setup environment variables

Create `.env` in backend root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4) Run app

```bash
# backend
cd server
npm run dev

# frontend (new terminal)
cd client
npm start
```

---

## 🔐 Authentication & Security

- Password hashing via `bcrypt`
- Token-based auth using `JWT`
- Role-based route protection
- Middleware checks for secure APIs
- Environment-based secret management

---

## 🌐 API Snapshot

> Update routes below if your exact paths differ.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Jobs
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` *(Recruiter only)*
- `PUT /api/jobs/:id` *(Recruiter only)*
- `DELETE /api/jobs/:id` *(Recruiter only)*

### Applications
- `POST /api/applications/:jobId`
- `GET /api/applications/me`
- `GET /api/applications/job/:jobId` *(Recruiter only)*

---

## 🎯 Why this project stands out

- Real-world **candidate + recruiter** use case
- Full-stack implementation using modern tools
- Strong base for adding advanced hiring features:
  - resume parsing
  - interview scheduling
  - admin analytics
  - notifications
  - payment/job promotion modules

---

## 🛠️ Troubleshooting

### MongoDB connection failed
- Check `MONGO_URI`
- Ensure Atlas network access allows your IP

### Token errors / unauthorized
- Verify `JWT_SECRET`
- Verify auth header format (`Bearer <token>`)

### CORS issues
- Add frontend URL in backend CORS config

### Dependency issues
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch
3. Commit changes
4. Push branch
5. Open Pull Request

---

## 📄 License

MIT License (recommended).  
You may replace this with your preferred license.

---

## 👨‍💻 Author

**Darshan Makwana**  
GitHub: [@karmaboy1309](https://github.com/karmaboy1309)

---

<div align="center">

### ⭐ If you like this project, drop a star and support the journey!

</div>
