FROM node:20-bullseye AS frontend-builder
WORKDIR /app
# Install build essentials for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Copy package files and install dependencies
COPY furniture-frontend/package.json furniture-frontend/package-lock.json ./
RUN npm install
# Copy source and build the frontend
COPY furniture-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-17 AS backend-builder
WORKDIR /backend
# Copy Maven project files
COPY furniture/pom.xml .
COPY furniture/src ./src
# Copy the built frontend into Spring Boot's static folder BEFORE packaging
COPY --from=frontend-builder /app/dist ./src/main/resources/static
# Build the backend jar (skip tests for faster build)
RUN mvn -B package -DskipTests

# Stage 3: Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy backend jar
COPY --from=backend-builder /backend/target/*.jar app.jar
# Create an uploads folder so image uploads work correctly in prod
RUN mkdir uploads
# Expose the default Spring Boot port
# Install netcat for the wait script
RUN apk add --no-cache bash netcat-openbsd

# Wait-for-MySQL script
COPY --chmod=755 <<'EOF' /app/wait-for-db.sh
#!/bin/bash
set -e
HOST="${DB_HOST:-localhost}"
PORT="${DB_PORT:-3306}"
echo "Waiting for MySQL at $HOST:$PORT..."
until nc -z "$HOST" "$PORT"; do
  echo "MySQL not ready yet – sleeping 3s"
  sleep 3
done
echo "MySQL is up – starting application"
exec java -jar app.jar
EOF

ENTRYPOINT ["/app/wait-for-db.sh"]
