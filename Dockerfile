FROM maven:3.9.6-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn -B clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/furniture-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
