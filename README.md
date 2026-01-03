# Two-Tier Web Application Deployment with DevOps

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Docker](https://img.shields.io/badge/docker-containerized-blue)]()

This project demonstrates the deployment of a **Two-Tier Web Application** (Python Flask + MySQL) on AWS EC2. The infrastructure utilizes **Docker** for containerization and **Jenkins** for a complete CI/CD pipeline, ensuring automated builds and deployments.
## 🌐 Live Access

| Service | URL | Description |
| :--- | :--- | :--- |
| **Web App** | `http://3.151.249.42:5000` | The Python Flask Application |
| **Jenkins** | `http://3.151.249.42:8080` | CI/CD Pipeline Dashboard |
| **Health Check** | `http://3.151.249.42:5000/health` | App Health Status |

## 🏗 Architecture & Tech Stack

<img width="1536" height="1024" alt="ChatGPT Image Jan 3, 2026, 04_21_53 PM" src="https://github.com/user-attachments/assets/2fb40fb6-8aef-4670-b715-ec0945fdcab2" />

* **Cloud Provider:** AWS (EC2)
* **OS:** Ubuntu (t3.small)
* **Containerization:** Docker & Docker Compose
* **CI/CD:** Jenkins
* **Application:** Python Flask (Backend)
* **Database:** MySQL
* **Networking:** Custom VPC Security Groups, Elastic IP

---

## ⚙️ Infrastructure Setup

### 1. EC2 Instance Provisioning
* **Instance Type:** `t3.small`
* **OS:** Ubuntu
* **Elastic IP:** Assigned to the instance to ensure a static public IP address for easy access.

### 2. Security Group Configuration
Inbound traffic rules configured to allow necessary services:

| Type | Protocol | Port Range | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| SSH | TCP | 22 | Anywhere (0.0.0.0/0) | Remote Access |
| HTTP | TCP | 80 | Anywhere (0.0.0.0/0) | Default Web Traffic |
| Custom TCP | TCP | 5000 | Anywhere (0.0.0.0/0) | Flask Application |
| Custom TCP | TCP | 8080 | Anywhere (0.0.0.0/0) | Jenkins Dashboard |

---

## 🛠️ Server Configuration

The following steps were taken to prepare the EC2 environment.

### 1. System Update & Docker Installation
```bash
# Update package database and upgrade system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
sudo apt install docker.io docker-compose -y

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker status
sudo systemctl status docker

# Grant current user permissions to use Docker
sudo usermod -aG docker $USER
```

### 2. Java & Jenkins Installation
Jenkins requires Java to run.
```bash
# Install Java JDK
sudo apt install openjdk-11-jdk -y

# Install Jenkins (LTS)
# Refer to official Jenkins docs for the latest repository keys:
# [https://www.jenkins.io/doc/book/installing/linux/](https://www.jenkins.io/doc/book/installing/linux/)

# Start and enable Jenkins service
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Grant Jenkins user permissions to use Docker
sudo usermod -aG docker jenkins

# Restart jenkins
sudo systemctl restart jenkins
```
## 🐳 Containerization Details
The application is containerized to ensure consistency across environments.

**Dockerfile Strategy**
* **Base Image:** `python:3.9-slim`
* **Workdir:** `/app`
* **Dependencies:** Installed via `requirements.txt`
* **Exposed Port:** `5000`

**Docker Compose Configuration**
The `docker-compose.yaml` orchestrates the two tiers:
**1.** **flask-app:** The web server.
**2.** **db:** The MySQL database.

**Key Features:**
* **Networking:** Both services run on a custom bridge network `two-tier-nt`.
* **Persistence:** MySQL data is persisted using the `mysql_data` volume.
* **Healthchecks:** Configured for both services to ensure dependency reliability.
*** Environment Variables:** Database credentials passed securely via environment config.

## 🚀 CI/CD Pipeline (Jenkins)
A `Jenkinsfile` is used to define the deployment pipeline.
**1. Access Jenkins:** Open browser at `http://<EC2-Public-IP>:8080`.
**2. Setup Job:** Created a new Pipeline job.
**3. SCM:** Configured Git with the repository URL and credentials.
**4. Branch:** Targeted `main` branch.

**Pipeline Stages:**
**1. Clone:** Pulls the latest code from GitHub.
**2. Build:** Builds the Docker image using the Dockerfile.
**3. Deploy:** Uses docker-compose up -d to launch the containers.

## 🌐 Accessing the Application
Once the Jenkins pipeline completes successfully:
* **App URL:** `http://<Elastic-IP>:5000`

## 📸 Project Results
### 1. Web Application Running
Below is the Flask application successfully running on port 5000.

<img width="1440" height="900" alt="Screenshot 2026-01-03 at 10 29 48 AM" src="https://github.com/user-attachments/assets/6f9b4434-f4ff-479a-ba8c-d04925f75faf" />

### 2. Database Connectivity
Below shows the successful connection to the MySQL database from the application container.

<img width="1338" height="685" alt="Screenshot 2026-01-03 at 10 43 23 AM" src="https://github.com/user-attachments/assets/180fb5b0-2ee2-42fe-8598-a68ef90399cf" />

