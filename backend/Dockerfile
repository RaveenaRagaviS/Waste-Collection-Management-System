
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app
COPY backend/ ./
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

COPY python-analysis/requirements.txt /app/python-analysis/requirements.txt

RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r /app/python-analysis/requirements.txt

COPY --from=build /app/target/*.jar app.jar
COPY database/ /app/database/
COPY python-analysis/ /app/python-analysis/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=render"]
