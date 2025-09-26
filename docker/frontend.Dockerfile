# docker/frontend.Dockerfile
FROM ubuntu:24.04

# Prevent interactive prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js 20 (via NodeSource) and other dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching npm install)
#COPY ../frontend/app/package*.json /app/

# Install dependencies
#RUN npm install

# Copy the rest of the frontend code
#COPY ../frontend .

# Expose Vite dev server port
EXPOSE 3000

# Run Vite dev server
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

