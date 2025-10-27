FROM node:20

WORKDIR /app

# Install PostgreSQL client tools so wait-for-db.sh works
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

# Make sure wait-for-db.sh is executable
RUN chmod +x wait-for-db.sh

EXPOSE 5000

# Use wait-for-db.sh to wait for DB before starting
CMD ["./wait-for-db.sh", "db", "5432", "npm", "start"]

