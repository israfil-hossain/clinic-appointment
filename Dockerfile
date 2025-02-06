# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application source code
COPY . .

# Build the Next.js application
RUN yarn build

# Remove development dependencies to reduce image size
RUN yarn install --production --frozen-lockfile

# Stage 2: Serve the Next.js app and run Cron Jobs
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install cron and other required utilities
RUN apk add --no-cache bash curl cron mongodb-tools

# Copy the production build and node_modules from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the cron job script and give it execution permissions
COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

# Set environment variable for production
ENV NODE_ENV=production

# Copy the crontab configuration
COPY crontab /etc/crontabs/root

# Expose port 3000
EXPOSE 3000

# Start Cron and the Next.js application
CMD crond && yarn start
