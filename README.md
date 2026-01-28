# 💍 Wedding Planning & Budget Management System

A full‑stack wedding planning application with a strong focus on  **budget tracking**, and **multi‑user access control**. The project enables users to create or join weddings, manage budgets and guest lists, and securely collaborate with controlled permissions.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT‑based authentication
* Role‑Based Access Control (RBAC): `OWNER`, `EDITOR`, `VIEWER`
* Invite‑based access to join existing weddings
* Centralized authentication & authorization middleware
* API rate limiting for security and abuse prevention

### 💰 Budget Management

* Category‑wise budget allocation
* Item‑level planned vs actual cost tracking
* Autosave‑safe updates
* Backend‑computed financial summaries
* PDF / XLS export support (frontend‑triggered)

### 👥 Guest Management

* Add and manage guest lists
* RSVP status updates
* Wedding‑scoped data isolation

### 🏗️ Backend System Design

* Multi‑tenant architecture using `weddingId`
* MongoDB data modeling with Mongoose
* Schema‑level validations and indexing
* Ownership checks on all write operations
* RESTful API design

---

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

**Frontend**

* React.js
* Axios
* CSS (Custom UI)

---

## 📂 Project Structure

```
backend/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── validators/
 └── server.js

frontend/
 ├── components/
 ├── pages/
 ├── services/
 └── styles/
```

---

## 🔑 Core Concepts Implemented

* **Multi‑Tenant Data Isolation**
  All domain entities (budgets, categories, items, guests) are scoped using a `weddingId`, ensuring users only access their own wedding data.

* **RBAC (Role‑Based Access Control)**
  Designed to support multiple roles with different permissions. Currently enforced at the API level via middleware.

* **Validation & Indexing**
  Mongoose schemas include validations and indexed fields for performance and data integrity.

* **Secure APIs**
  All sensitive routes are protected using JWT authentication and role checks.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📈 Future Improvements

* Real‑time collaboration using WebSockets
* Budget snapshots & version history
* Soft deletes and audit logs
* Advanced analytics dashboards
* Email‑based wedding invitations

---

## 👩‍💻 Author

**Priya**
Computer Science Engineering Student
---

⭐ If you find this project useful, feel free to star the repository!
