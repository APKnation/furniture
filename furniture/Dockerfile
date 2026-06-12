FROM maven:3.9.9-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn -B clean package -DskipTests

FROM openjdk:17-jdk-slim
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
