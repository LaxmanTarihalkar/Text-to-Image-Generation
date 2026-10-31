<<<<<<< HEAD
# Pixora AI — Text to Image Generation SaaS

A full-stack AI image generation platform built with the MERN stack.

## Quick Start

### 1. Setup Server

```bash
cd server
npm install
# Edit .env with your MongoDB URI and Razorpay keys
node utils/seedAdmin.js   # Creates admin@pixora.ai / admin123
npm run dev
```

### 2. Setup Client

```bash
cd client
npm install
npm run dev
```

### 3. Open in browser

- App: http://localhost:5173
- API: http://localhost:5000

## Environment Variables (server/.env)

| Variable | Description |
|---|---|
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT tokens |
| RAZORPAY_KEY_ID | Razorpay test key ID |
| RAZORPAY_KEY_SECRET | Razorpay test key secret |
| CLIENT_URL | Frontend URL (default: http://localhost:5173) |

## Default Credentials

- Admin: `admin@pixora.ai` / `admin123`
- Admin Panel: http://localhost:5173/admin

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Auth: JWT + bcrypt
- AI: Pollinations AI (free)
- Payments: Razorpay (test mode)
=======
# Text-to-Image-Generation
An AI-powered Text-to-Image Generation platform that transforms text prompts into creative images using AI models and modern web technologies.
>>>>>>> c67c00c583c286496731d15d0d0ae18ce5402345
