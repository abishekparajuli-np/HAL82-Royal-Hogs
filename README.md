# HAL82-Royal-Hogs
# HAL82-Royal-Hogs
## Team Mates
- Abishek Parajuli
- Nirjal Paudel
- Aayush Dulal
- Anamol Khadka

HATI is a full-stack web application built with a React frontend and a Flask backend, both orchestrated using Docker containers.

## Overview

- **Frontend:** Built with React, providing a dynamic and responsive user interface.
- **Backend:** Developed in Flask (Python), serving REST API endpoints and handling business logic.
- **Docker:** Manages, builds, and deploys both services in isolated containers for consistency and reproducibility.

## Features

- Modern SPA (Single Page Application) with React
- RESTful API powered by Flask
- Containerized deployment using Docker
- Easy setup: No manual environment configuration needed

## Project Structure

```
├── frontend       # React application source
├── backend        # Flask application source
├── migrations     # Database migration scripts/config
├── Dockerfile     # Backend Docker configuration
├── docker-compose.yml # Multi-container setup for frontend & backend
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (including Docker Compose)
- Optional: [Node.js](https://nodejs.org/) and [Python](https://www.python.org/) for local development outside containers

## Setup & Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/abishekparajuli-np/HAL82-Royal-Hogs.git
cd HAL82-Royal-Hogs
```

### 2. Run with Docker Compose

This will build and launch both Flask (backend) and React (frontend) containers:

```bash
docker-compose up --build
```

- The **frontend** will typically be available at [http://localhost:3000](http://localhost:3000)
- The **backend** (Flask API) at [http://localhost:5000](http://localhost:5000)

### 3. Stopping the Containers

Press `Ctrl+C` to stop. To remove containers, networks, and volumes:

```bash
docker-compose down
```

## Local Development (Optional)

If you prefer running services outside Docker:

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

## Customization

- Set environment variables for database, secret keys, and other config in the `docker-compose.yml` or `.env` files as needed.
- Edit frontend code in `/frontend` and backend code in `/backend`.

## Contributing

Contributions are welcome! Please fork the repository and open a pull request.




## License

Specify your license here.

---

**HAL82-Royal-Hogs** leverages Docker to streamline development and deployment, React for a powerful frontend, and Flask for a robust backend API.