# frontend/Dockerfile

# Use the official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose the Vite development port
EXPOSE 5173

# ✅ Run Vite with --host so it's reachable outside container
CMD ["npm", "run", "dev", "--", "--host"]
