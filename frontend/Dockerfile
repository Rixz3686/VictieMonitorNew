# Stage 1: Build the React app
FROM oven/bun:latest AS builder

WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Serve static files
FROM oven/bun:latest

WORKDIR /app

# Install a simple static file server
RUN bun add serve

# Copy built files dari stage builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
# -s = single-page app mode (fallback ke index.html untuk React Router)
# -l = listen port
CMD ["bunx", "serve", "dist", "-s", "-l", "3000"]