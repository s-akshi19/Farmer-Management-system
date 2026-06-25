# 🌾 Farmer Management System

## 🌐 Live Demo

🔗 **[Live Website](https://farmer-management-system-pr6lk8tpd-sakshi-projects2.vercel.app)**

> Backend API: https://farmer-management-system-2vg1.onrender.com

A full-stack web platform for managing 100+ farmer records with crop tracking, land management, and live market price updates — built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## ✨ Features

- 🔐 **JWT Authentication** — Admin and Officer roles
- 👨‍🌾 **Farmer Records** — Add, edit, delete, search, filter 100+ farmer profiles
- 🗺️ **Land Management** — Track multiple land parcels per farmer (khasra, soil type, irrigation)
- 🌱 **Crop Tracking** — Sowing dates, harvest dates, yield tracking per crop season
- 📈 **Live Market Prices** — Real-time mandi rates for 12+ major crops with price trends
- 📊 **Analytics Dashboard** — Charts for district-wise distribution, crop status, total acreage
- 📱 **Responsive UI** — Mobile-friendly, built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (Vite), React Router, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT, bcryptjs |

---

## 📁 Project Structure

```
farmer-management/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Navbar, Layout, common components
│   │   ├── pages/        # Dashboard, Farmers, FarmerDetail, Market, Login
│   │   ├── context/      # AuthContext
│   │   ├── services/     # API calls
│   │   └── App.jsx
│   └── package.json
│
├── server/               # Express backend
│   ├── models/           # Farmer, Land, Crop, MarketPrice, User
│   ├── controllers/      # farmerController, landCropController, marketController
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, errorHandler
│   ├── utils/seedData.js # Seeds 100 farmer records
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)

### 1. Clone the repo
```bash
git clone https://github.com/s-akshi19/farmer-management.git
cd farmer-management
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
```
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5174
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/farmer-management
JWT_SECRET=any_long_random_string
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

```bash
npm run seed    # Seeds 100 farmers + demo users
npm run dev     # Starts server on http://localhost:5001
```

### 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5001/api
npm run dev             # Starts on http://localhost:5174
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | password123 |
| Officer | officer@demo.com | password123 |

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/farmers` | List farmers (search/filter/paginate) |
| POST | `/api/farmers` | Add farmer |
| GET | `/api/farmers/stats` | Dashboard statistics |
| GET | `/api/farmers/:id` | Farmer detail with land & crops |
| PUT | `/api/farmers/:id` | Update farmer |
| DELETE | `/api/farmers/:id` | Delete farmer |
| POST | `/api/farmers/:id/lands` | Add land record |
| POST | `/api/farmers/:id/crops` | Add crop record |
| GET | `/api/market` | Get market prices (live + saved) |
| POST | `/api/market` | Add manual price |

---

## 👩‍💻 Author

**Sakshi Tripathi** — B.Tech CSE, ABES Institute of Technology
[GitHub](https://github.com/s-akshi19) · sakshitripathi477@gmail.com

---

## 📄 License
MIT
