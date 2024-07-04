FROM node:20-alpine

WORKDIR /app

RUN apk update && \
    apk add --no-cache g++ && \
    apk add --no-cache openjdk11-jdk && \
    apk add --no-cache build-base && \
    apk add --no-cache python3 && \
    ln -sf python3 /usr/bin/python && \
    ln -sf pip3 /usr/bin/pip && \
    apk add --no-cache libc6-compat

RUN apk add --no-cache docker-cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "app.js" ]