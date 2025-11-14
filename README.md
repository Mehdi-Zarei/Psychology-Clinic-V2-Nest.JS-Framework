<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

![image](https://github.com/Mehdi-Zarei/Psychology-Clinic-V2-Nest.JS-Framework/raw/b58ed238a93f0f19edf1fbee6fed816980a0a50f/public/images/psychologist-profile/building-rowlett.jpg)

# 🧠 Psychology Clinic REST API (Version 2)

Welcome to the **Psychology Clinic API V2**! This powerful backend drives a mental health platform where users can book appointments with psychologists, share reviews, and explore educational articles. Crafted with **NestJS** and **PostgreSQL**, it’s built for scalability, security, and a smooth user experience. Whether you're a user seeking support or a psychologist offering services, this API has you covered.

---

## 🚀 Table of Contents

- [✨ Features](#features)
- [⚙️ Tech Stack](#tech-stack)
- [📦 Setup & Installation](#setup--installation)
- [🗄️ Database Setup](#database-setup)
- [🛡️ Security & Authentication](#security--authentication)
- [📚 API Docs](#api-docs)
- [🔮 Roadmap](#roadmap)
- [📋 Dependencies](#dependencies)
- [✉️ Contact & License](#contact--license)

---

## ✨ Features

A feature-rich platform connecting users and mental health professionals:

- **Effortless Onboarding:**
  - Quick sign-up for users and psychologists with role-based access (`USER`, `PSYCHOLOGIST`, `ADMIN`).
  - Psychologists submit credentials for admin approval.
- **Secure Authentication:**
  - OTP-based login via SMS/email, stored in Redis with a **1-minute TTL**.
  - JWT access and refresh tokens with Redis session management.
- **Smart Appointment Booking:**
  - Psychologists set available time slots; users book in real-time.
  - **TypeORM transactions** ensure no double-booking.
- **Automated Notifications:**
  - SMS/email alerts for booking confirmations and session reminders.
  - Background jobs handle session status updates (`reserved` → `done`).
- **Community & Content:**
  - Admin-curated articles with likes, comments, and infinite-scroll pagination.
  - User reviews and ratings for psychologists, pending admin approval.
- **Admin Dashboard:**
  - Manage psychologist approvals, reviews, articles, and user accounts.
  - Monitor platform activity with detailed controls.

- **Automated Session Status Updates:**
  - A cron job runs every 10 minutes to check the database and automatically updates the status of reservations to `done` if their end time has passed.
- **Bulk SMS Queue System:**
  - Implemented a queue system using the **Bull** package to handle bulk SMS sending (e.g., for clinic anniversary discounts or mass promotions), ensuring minimal load on the server and the SMS service provider.

### 🔐 Authentication Flow

- **OTP Verification:**
  - Users receive a one-time code via SMS/email.
  - OTPs are stored in Redis with rate-limiting to prevent abuse.
- **JWT Security:**
  - Short-lived access tokens for API requests.
  - Long-lived refresh tokens, hashed and stored in Redis.
- **Role-Based Access:**
  - Endpoints restricted to `USER`, `PSYCHOLOGIST`, or `ADMIN` roles.

### 👥 User & Psychologist Experience

1. **User Flow:**
   - Sign up → verify phone/email → set password → explore psychologists.
   - Book appointments and leave reviews (approved by admins).
2. **Psychologist Flow:**
   - Register → submit credentials → await admin approval.
   - Publish available slots and manage bookings.
3. **Booking Process:**
   - Users browse real-time availability.
   - Confirm bookings with instant SMS/email notifications.

### 📅 Appointment System

- **Atomic Operations:**
  - TypeORM transactions ensure safe, conflict-free bookings.
- **Scheduled Jobs:**
  - NestJS Schedule updates session statuses automatically.
- **Notifications:**
  - Real-time booking confirmations and pre-session reminders.

### 💬 Reviews & Ratings

- Users submit reviews and ratings, visible after admin approval.
- Admins manage all reviews, approved or pending, via a dedicated panel.

### 📝 Articles

- Admins publish articles with rich media support.
- Users engage with likes, comments, and ratings.
- Optimized comment loading with infinite-scroll pagination.

### 📨 Bulk SMS System

- Utilizes **Bull** to queue bulk SMS tasks, enabling efficient mass messaging (e.g., for clinic-wide promotions like anniversary discounts).
- Prevents server and SMS provider overload by processing messages asynchronously.

### 🛠️ Admin Tools

- Approve/reject psychologist credentials and reviews.
- Manage articles and user accounts.
- Track platform metrics and activity.

---

## ⚙️ Tech Stack

- **NestJS**: TypeScript-first framework for scalable APIs.
- **PostgreSQL**: Reliable relational database with TypeORM.
- **Redis**: Fast storage for OTPs and sessions.
- **Class-Validator**: DTO validation for secure inputs.
- **bcrypt**: Password hashing for user security.
- **jsonwebtoken**: JWT-based authentication.
- **NestJS Schedule**: Background job management.
- **Multer**: Secure file uploads for images.
- **Swagger**: Interactive API documentation.
- **Nodemailer**: Email notifications.
- **Utilities**: `nanoid`, `slugify`, `@nestjs/config`.

---

## 📦 Setup & Installation

```bash
git clone https://github.com/Mehdi-Zarei/psychology-clinic-v2.git
cd psychology-clinic-v2
npm install
```

1. Environment Variables

Copy .env.example to .env and configure:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/psychology_clinic
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
SMS_API_KEY=your_sms_api_key
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
DOMAIN=http://localhost:3000
```

2. PostgreSQL

Ensure PostgreSQL is running and create a database:

```bash
createdb psychology_clinic
```

3. Redis

```bash
Install Redis locally or use a cloud provider.
Verify with redis-cli ping.
```

```bash
4. Start the API

Launch the development server:bashnpm run start:dev
API available at http://localhost:3000.
```

```bash
🗄️ Database Setup
The platform uses PostgreSQL with TypeORM for data management. Core entities include:
```

```bash
User: User profiles (name, email, phone, role).
Psychologist: Credential and availability data.
Booking: Appointment details (date, time, status).
Review: User feedback and ratings.
Article: Educational content with engagement metrics.
```

Transactions

```bash
Booking operations use TypeORM transactions for data integrity:typescriptawait queryRunner.manager.save(booking);
await queryRunner.commitTransaction();
```

🛡️ Security & Authentication

```bash
OTP System:
1-minute TTL for OTPs in Redis.
Rate-limiting to block abuse.
```

```bash
JWT Tokens:
Access tokens: Short-lived (e.g., 15 minutes).
Refresh tokens: Long-lived (e.g., 30 days), stored in Redis.

Role Guards:
Restrict access to endpoints based on user roles.

Input Validation:
DTOs validated with class-validator for secure data handling.

File Uploads:
Multer ensures safe handling of image uploads.
```

📚 API Docs

```bash
Interactive documentation powered by Swagger.
Access at:texthttp://localhost:3000/api
Key endpoints:
POST /auth/signup: Register a new user.
POST /bookings: Book an appointment.
GET /articles: Fetch articles with pagination.
PATCH /reviews/:id: Approve/reject reviews (admin-only).
```

📋 Dependencies

```json
"dependencies": {
    "@nestjs/axios": "^4.0.1",
    "@nestjs/bull": "^11.0.4",
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/jwt": "^11.0.1",
    "@nestjs/platform-express": "^11.1.8",
    "@nestjs/schedule": "^6.0.1",
    "@nestjs/swagger": "^11.2.1",
    "@nestjs/typeorm": "^11.0.0",
    "@types/bcrypt": "^6.0.0",
    "bcrypt": "^6.0.0",
    "bull": "^4.16.5",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "ioredis": "^5.8.2",
    "multer": "^2.0.2",
    "nanoid": "^3.3.4",
    "pg": "^8.16.3",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.27"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.10.7",
    "@types/cookie-parser": "^1.4.10",
    "@types/express": "^5.0.5",
    "@types/jest": "^29.5.14",
    "@types/multer": "^2.0.0",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.4.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  }
```

✉️ Contact & License

Email:mahdizareiofficial@gmail.com
GitHub:Mehdi-Zarei

📜 License
MIT License
Copyright (c) 2025 Mehdi Zarei
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
