FROM node:20-bullseye AS frontend-builder
WORKDIR /app
# Install build essentials for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
# Copy package files and install dependencies
COPY furniture-frontend/package.json furniture-frontend/package-lock.json ./
RUN npm ci --silent
# Copy source and build the frontend
COPY furniture-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-17 AS backend-builder
WORKDIR /backend
# Copy Maven project files
COPY furniture/pom.xml .
COPY furniture/src ./src
# Build the backend jar (skip tests for faster build)
RUN mvn -B package -DskipTests

# Stage 3: Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy backend jar
COPY --from=backend-builder /backend/target/*.jar app.jar
# Copy built frontend static files
COPY --from=frontend-builder /app/dist ./static
# Expose the default Spring Boot port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
