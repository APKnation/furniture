FROM maven:3.9.9-openjdk-17 AS build
WORKDIR /app
# Copy the entire repository (backend resides in furniture/)
COPY . .
# Build the backend JAR, skipping tests for speed
RUN mvn -B -f ./furniture/pom.xml clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the built JAR from the build stage
COPY --from=build /app/furniture/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
