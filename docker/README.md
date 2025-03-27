# Docker Compose Setup

This directory contains Docker Compose configuration for running various services.

## Services

- **PostgreSQL**: Database service using pgvector
- **n8n**: Workflow automation tool

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker concepts

### Environment Variables

Before starting the services, make sure to set up the environment variables:

1. For PostgreSQL, check `docker.postgres.env`
2. For n8n, check `docker.n8n.env`

### Starting the Services

To start all services:

```bash
cd docker
docker-compose up -d
```

To start a specific service:

```bash
cd docker
docker-compose up -d postgres
docker-compose up -d n8n
```

### Accessing n8n

Once the services are running, you can access n8n at:

http://localhost:5678

The default login credentials will be set during the first login.

### Stopping the Services

To stop all services:

```bash
cd docker
docker-compose down
```

To stop a specific service:

```bash
cd docker
docker-compose stop n8n
```

## Data Persistence

Data is persisted using Docker volumes:

- `postgres-data`: PostgreSQL data
- `n8n-data`: n8n workflows and data

## Configuration

### n8n Configuration

You can modify the n8n configuration in the `docker.n8n.env` file. Important settings include:

- `N8N_PORT`: The port n8n will run on (default: 5678)
- `N8N_ENCRYPTION_KEY`: Secret key for encrypting credentials (change this for production)
- Database connection settings

For more configuration options, refer to the [n8n documentation](https://docs.n8n.io/hosting/environment-variables/).