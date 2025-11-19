FROM node:20

WORKDIR /app


RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .


RUN chmod +x wait-for-db.sh

EXPOSE 5000


CMD ["./wait-for-db.sh", "db", "5432", "npm", "start"]

