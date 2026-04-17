# Two-Tier Web Application — Flask + React + MySQL

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Docker](https://img.shields.io/badge/docker-containerized-blue)]()
[![React](https://img.shields.io/badge/frontend-react-61dafb)]()

A full-stack message board application built with a **React frontend**, **Python Flask REST API**, and **MySQL database** — deployed on AWS EC2 using Docker and a fully automated Jenkins CI/CD pipeline.

---

## 🌐 Live Access

| Service | URL | Description |
| :--- | :--- | :--- |
| **React App** | `http://3.151.249.42:3000` | React frontend (Vite) |
| **Flask API** | `http://3.151.249.42:5000` | REST API backend |
| **Jenkins** | `http://3.151.249.42:8080` | CI/CD Pipeline Dashboard |
| **Health Check** | `http://3.151.249.42:5000/health` | API Health Status |

---

## 🏗 Architecture & Tech Stack

<img width="1536" height="1024" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/2fb40fb6-8aef-4670-b715-ec0945fdcab2" />

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, CSS |
| **Backend** | Python Flask, Flask-CORS |
| **Database** | MySQL |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | Jenkins |
| **Cloud** | AWS EC2 (t3.small, Ubuntu) |
| **Networking** | Custom VPC Security Groups, Elastic IP |

---

## 📁 Project Structure

```
├── app.py                  # Flask REST API
├── requirements.txt        # Python dependencies
├── Dockerfile              # Flask container
├── docker-compose.yaml     # Orchestrates all 3 services
├── Jenkinsfile             # CI/CD pipeline definition
├── templates/              # Legacy HTML templates
└── client/                 # React frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js      # Dev proxy → Flask
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

---

## 🔌 API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/messages` | Returns all messages as JSON |
| `POST` | `/submit` | Inserts a new message (form data) |
| `GET` | `/health` | Health check |

---

## ⚙️ Infrastructure Setup

### 1. EC2 Instance Provisioning
- **Instance Type:** `t3.small`
- **OS:** Ubuntu
- **Elastic IP:** Assigned for a static public address

### 2. Security Group Configuration

| Type | Protocol | Port | Purpose |
| :--- | :--- | :--- | :--- |
| SSH | TCP | 22 | Remote Access |
| HTTP | TCP | 80 | Default Web Traffic |
| Custom TCP | TCP | 3000 | React Frontend |
| Custom TCP | TCP | 5000 | Flask API |
| Custom TCP | TCP | 8080 | Jenkins Dashboard |

---

## 🛠️ Server Configuration

### Docker & Jenkins Installation
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker $USER

# Jenkins (requires Java)
sudo apt install openjdk-11-jdk -y
sudo systemctl start jenkins && sudo systemctl enable jenkins
sudo usermod -aG docker jenkins && sudo systemctl restart jenkins
```

---

## 🐳 Containerization

Docker Compose orchestrates three services:

1. **frontend** — React app served via Vite on port 3000
2. **flask-app** — REST API on port 5000
3. **db** — MySQL with persistent volume storage

**Key features:**
- Custom bridge network `two-tier-nt` for inter-service communication
- MySQL data persisted via `mysql_data` Docker volume (zero data loss on restart)
- Health checks on both `flask-app` and `db` services
- Database credentials injected via environment variables

---

## 🚀 CI/CD Pipeline (Jenkins)

The `Jenkinsfile` defines a 3-stage pipeline triggered on every push to `main`:

1. **Clone** — pulls latest code from GitHub
2. **Build** — builds Docker image from Dockerfile
3. **Deploy** — runs `docker-compose up -d` to launch all containers

---

## 💻 Running Locally

### Option 1 — Docker Compose (full stack)
```bash
git clone https://github.com/Srigana/TwoTier-Architecture-Flask-Web-App-Deployment
cd TwoTier-Architecture-Flask-Web-App-Deployment
docker-compose up --build
```
- React: `http://localhost:3000`
- Flask API: `http://localhost:5000`

### Option 2 — Manual (dev mode)
```bash
# Terminal 1: Flask backend
pip install -r requirements.txt
python app.py

# Terminal 2: React frontend
cd client
npm install
npm run dev
```

---

## 📸 Project Results

### React Frontend
<img width="1440" height="900" alt="React frontend running" src="https://github.com/user-attachments/assets/6f9b4434-f4ff-479a-ba8c-d04925f75faf" />

### Database Connectivity
<img width="1338" height="685" alt="MySQL connection from Flask container" src="https://github.com/user-attachments/assets/180fb5b0-2ee2-42fe-8598-a68ef90399cf" />
