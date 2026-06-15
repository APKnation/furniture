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
# Install bash and mysql-client (for mysqladmin ping) and netcat
RUN apk add --no-cache bash mysql-client

# Create wait-for-MySQL script that uses mysqladmin ping
RUN printf '#!/bin/bash\n\
set -e\n\
HOST="${DB_HOST:-localhost}"\n\
PORT="${DB_PORT:-3306}"\n\
USER="${DB_USERNAME:-root}"\n\
PASS="${DB_PASSWORD:-}"\n\
echo "Waiting for MySQL at $HOST:$PORT..."\n\
MAX_TRIES=100\n\
TRIES=0\n\
until mysqladmin ping -h"$HOST" -P"$PORT" -u"$USER" -p"$PASS" --silent 2>/dev/null; do\n\
  TRIES=$((TRIES+1))\n\
  if [ $TRIES -ge $MAX_TRIES ]; then\n\
    echo "Timed out waiting for MySQL after $MAX_TRIES attempts"\n\
    exit 1\n\
  fi\n\
  echo "MySQL not ready yet (attempt $TRIES/$MAX_TRIES) - sleeping 5s"\n\
  sleep 5\n\
done\n\
echo "MySQL is up - starting application"\n\
exec java -jar /app/app.jar\n\
' > /app/wait-for-db.sh && chmod +x /app/wait-for-db.sh

EXPOSE 8080
ENTRYPOINT ["/app/wait-for-db.sh"]
