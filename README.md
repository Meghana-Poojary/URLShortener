# 🔗 SHORTLY - URL Shortener

A modern **URL Shortener** application that allows users to generate short, shareable links and **track detailed analytics** such as visit counts, visitor IP addresses, and timestamps.

---

## ✨ Features

- 🔗 Generate short, shareable URLs  
- 📊 Track link analytics:
  - Total visit counts
  - Visitor IP addresses
  - Time and date of each visit
- 🔐 Secure backend 

---

## 🛠️ Tech Stack

### Frontend
- **React**

### Backend
- **Node.js**
- **Express.js**

### Database
- **PostgreSQL**

---

## 🧠 How It Works

1. User submits a long URL  
2. Backend generates a unique short URL  
3. Short URL redirects to the original link  
4. Each visit is logged with:
   - IP address
   - Visit timestamp
5. Analytics can be viewed per short URL  

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm

---

### Installation

```bash
# Clone the repository
git clone https://github.com/Meghana-Poojary/URLShortener.git
```

### Backend Setup

```bash
cd backend
npm install
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a .env file in the backend directory:

```bash
PORT=5000
DATABASE_URL=your_postgresql_connection_string
```

Create a .env file in the frontend directory:

```bash
VITE_API_URL=your_backend_url
```


## Website is live on _https://urlshortener-1-ne4n.onrender.com_
