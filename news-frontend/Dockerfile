FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy application code (will be overridden by volume mount in dev)
COPY . .

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run in development mode
CMD ["npm", "run", "dev"]
