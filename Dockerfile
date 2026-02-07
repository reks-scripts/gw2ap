FROM node:18-alpine

# Install build tools
RUN apk update && apk add python3 make g++

# Create app directory
WORKDIR /usr/app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Set NODE_OPTIONS for OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"]
