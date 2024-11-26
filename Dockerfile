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

# Stage 2: Serve the Next.js app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the production build and node_modules from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set environment variable for production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]