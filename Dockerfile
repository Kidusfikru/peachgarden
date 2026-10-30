# Dockerfile for local build
#Support complete source code build process

FROM oven/bun:1-alpine AS builder

# Set working directory
WORKDIR/app

#Copy package file
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

#Copy source code
COPY . .

# Build project
RUN bun run build

# Production stage
FROM nginx:alpine

#Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean up default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the build product to the nginx static file directory
COPY --from=builder /app/docs /usr/share/nginx/html

#Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]