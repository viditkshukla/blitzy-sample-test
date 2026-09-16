# Use Node.js 18.x LTS Alpine as the base image for a small footprint
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
# This leverages Docker layer caching for dependencies
COPY src/backend/package*.json ./

# Install only production dependencies to minimize image size and attack surface
RUN npm install --production

# Copy application source code to the container
COPY src/backend/ ./

# Set default port environment variable
ENV PORT=3000

# Set Node.js environment to production mode
ENV NODE_ENV=production

# Document that the container listens on port 3000
EXPOSE 3000

# Define the command to run the application when the container starts
CMD ["node", "index.js"]