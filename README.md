# Aggregator

Aggregator is an internal AI-powered benchmarking tool designed to automate the "external context" research phase in strategic consulting projects. It collects high-quality primary sources from the web using LLM agents, allowing consultants to accelerate research, maintain consistency, and generate strategic insights faster.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Start the Backend](#start-the-backend)
  - [Start the Frontend](#start-the-frontend)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the Aggregator tool, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Python](https://www.python.org/) (v3.8 or higher)
- [pip](https://pip.pypa.io/en/stable/installation/) (Python package manager)
- [Neo4j](https://neo4j.com/download/) (local instance or remote access)
- [Docker](https://www.docker.com/products/docker-desktop/) (recommended for Neo4j setup)
- [Git](https://git-scm.com/downloads)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/aggregator.git
cd aggregator
```

### Neo4j Setup with Docker

We recommend using Docker to run the Neo4j database locally for development:

1. Pull the Neo4j Docker image:

```bash
docker pull neo4j:latest
```

2. Run Neo4j container:

```bash
docker run \
    --name aggregator-neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/your_secure_password \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/plugins:/plugins \
    -d \
    neo4j:latest
```

> **Note:** On Windows PowerShell, you may need to adjust the volume paths or use a different syntax:
> ```powershell
> docker run --name aggregator-neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/your_secure_password -v "%USERPROFILE%\neo4j\data:/data" -v "%USERPROFILE%\neo4j\logs:/logs" -d neo4j:latest
> ```

3. Access Neo4j Browser at `http://localhost:7474` to verify the installation.

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment (recommended):

```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install the required Python packages:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:

   First, copy the template file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your specific configuration values:
   ```
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_secure_password
   ```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install the required Node.js packages:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

   First, copy the template file:
   ```bash
   cp .env.example .env
   ```
   
   Or create it manually with:
   ```
   VITE_API_URL=http://localhost:8000
   ```

## Running the Application

To run the application locally for development, you need to start both the backend and frontend servers.

### Start the Backend

1. Navigate to the backend directory (if not already there):

```bash
cd backend
```

2. Activate the virtual environment (if you created one):

```bash
# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Start the backend server:

```bash
uvicorn app:app --reload
```

The backend will be available at http://localhost:8000.

### Start the Frontend

1. Open a new terminal window/tab

2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173 (or a similar port if 5173 is already in use).

## Environment Configuration

For security and flexibility, Aggregator uses environment variables for configuration. We've included two example files (`.env.example`) in the repository that show the required variables.

### Backend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| NEO4J_URI | URI for connecting to Neo4j database | bolt://localhost:7687 |
| NEO4J_USER | Neo4j database username | neo4j |
| NEO4J_PASSWORD | Neo4j database password | *your secure password* |

### Frontend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| VITE_API_URL | URL of the backend API | http://localhost:8000 |

## Troubleshooting

### Common Issues

1. **Neo4j Connection Errors**
   - Ensure Neo4j is running: `docker ps` to check if the container is active
   - Restart Neo4j if needed: `docker restart aggregator-neo4j`
   - Verify credentials in the `.env` file match what you set in the Docker command
   - Check that the Neo4j ports are accessible with `curl localhost:7474` or visiting in your browser

2. **Backend Startup Failures**
   - Ensure all dependencies are installed
   - Verify Python version compatibility
   - Check for errors in the console output

3. **Frontend Build or Run Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Ensure Node.js version is compatible
