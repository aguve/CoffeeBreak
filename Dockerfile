FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src/ src/
COPY web/ web/
RUN mvn clean package -DskipTests -B

FROM tomcat:11.0-jdk21
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /app/target/CoffeeBreak.war /usr/local/tomcat/webapps/CoffeeBreak.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
