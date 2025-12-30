pipeline{
    agent any
    stages{
        stage('Clone repo'){
            steps{
                git branch: 'main', url: 'https://github.com/Srigana/DevOps-Project-Two-Tier-Flask-App.git'
            }
        }
        stage('Build image'){
            steps{
                sh 'docker build -t flask-app .'
            }
        }
        stage('Deploy with docker compose'){
            steps{
                // stop and remove existing containers if any
                sh 'docker compose down || true'
                // deploy the application using docker compose
                sh 'docker compose up -d --build'
            }
        }
    }
}