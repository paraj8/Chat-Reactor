# 💬 Chat Reactor

A modern real-time chat application built with the MERN stack, Socket.IO, and React Native (Expo).

Chat Reactor allows users to create an account using OTP email verification, log in securely with JWT authentication, view other users, and exchange messages instantly using WebSockets.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Email OTP Verification
- Secure Password Hashing (bcrypt)
- JWT Authentication
- Login
- Logout
- Persistent Login

---

## 💬 Real-Time Chat

- One-to-One Messaging
- Instant Message Delivery
- Socket.IO Integration
- Automatic Message Updates
- Chat History
- Auto Scroll
- Dark Modern UI

---

## 👤 User System

- User List
- Online Connection Support
- JWT Protected APIs
- Current User API

---

## 📧 Email Verification

- 6 Digit OTP
- Gmail SMTP
- Professional HTML Email Template
- OTP Expiration (5 Minutes)

---

# 🛠 Tech Stack

## Frontend (Mobile)

- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage
- Socket.IO Client
- Expo Vector Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt
- Nodemailer

---

# 📂 Project Structure

```
Chat-Reactor/

│
├── backend/
│   ├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   │
│   └── server.js
│
└── mobile/
    ├── assets/
    ├── components/
    ├── navigation/
    ├── screens/
    ├── services/
    ├── utils/
    └── App.js
```

---

# 🚀 Getting Started

## 1 Clone Repository

```bash
git clone https://github.com/yourusername/chat-reactor.git
```

---

# Backend Setup

Go inside backend

```bash
cd backend
```

Install packages

```bash
npm install
```

Create a `.env`

```
PORT=5000

MONGO_URI=YOUR_MONGODB_URL

JWT_SECRET=YOUR_SECRET_KEY

EMAIL_USER=yourgmail@gmail.com

EMAIL_PASS=your_google_app_password
```

Run backend

```bash
npm run dev
```

Server

```
http://localhost:5000
```

---

# Mobile Setup

Go inside mobile

```bash
cd mobile
```

Install packages

```bash
npm install
```

Start Expo

```bash
npx expo start
```

---

# Building APK

Install EAS CLI

```bash
npm install -g eas-cli
```

Login

```bash
eas login
```

Configure

```bash
eas build:configure
```

Generate APK

```bash
eas build -p android --profile preview
```

---

# API Routes

## Authentication

```
POST /api/auth/send-otp

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

---

## Users

```
GET /api/users
```

---

## Messages

```
GET /api/messages/:receiverId

POST /api/messages
```

---

# Authentication Flow

```
User enters details

↓

OTP Generated

↓

OTP Stored in MongoDB

↓

OTP Sent via Email

↓

User enters OTP

↓

OTP Verified

↓

Account Created

↓

Login

↓

JWT Token Generated

↓

Token Stored in AsyncStorage
```

---

# Chat Flow

```
User Login

↓

Socket.IO Connection

↓

Join Personal Socket Room

↓

Send Message

↓

Message Saved to MongoDB

↓

Backend Emits Message

↓

Receiver Gets Message Instantly

↓

Chat Updated
```

---

# Database Collections

## Users

```
username

email

password

isVerified

createdAt
```

---

## OTP

```
email

otp

expiresAt
```

---

## Messages

```
sender

receiver

message

seen

createdAt
```

---

# Security

- Password Hashing
- JWT Authentication
- Protected APIs
- OTP Expiration
- MongoDB Validation

---

# Future Improvements

- ✅ Typing Indicator
- ✅ Online Status
- ✅ Last Seen
- ✅ Read Receipts
- ✅ Push Notifications
- ✅ Image Sharing
- ✅ Voice Messages
- ✅ Group Chat
- ✅ Video Calling
- ✅ Profile Pictures
- ✅ Delete Messages
- ✅ Edit Messages
- ✅ Message Search
- ✅ Chat Backup

---

# Screens

- Splash Screen
- Login
- Register
- OTP Verification
- Users List
- Chat Screen

---

# Author

**Paraj Mandal**

Computer Science Student

Full Stack Developer

YouTube Creator

GitHub:
https://github.com/paraj8

---

# License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project, don't forget to give it a ⭐ on GitHub.

Happy Coding 🚀