# Use Node.js 18 with Alpine Linux as the base image for a minimal footprint
# Node.js version: 18.x LTS
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install only production dependencies for smaller image size
# Uses npm ci for deterministic builds instead of npm install
RUN npm ci --only=production

# Copy the application code to the container
COPY . .

# Document that the container listens on port 3000
EXPOSE 3000

# Command to run the application
# Uses the array syntax for proper signal handling
CMD ["node", "index.js"]