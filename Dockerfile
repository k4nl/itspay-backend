FROM node:18-alpine3.14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache python3 make g++

RUN npm rebuild bcrypt --build-from-source

RUN chmod +x scripts/start.sh

EXPOSE 3001

CMD ["npm", "run", "start:linux"]