FROM oven/bun:latest
LABEL environment="production"

WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* ./
RUN bun install --production
COPY . .

# Buat direktori data untuk SQLite persistent storage
RUN mkdir -p /app/data

# Railway otomatis menyediakan PORT via environment variable
EXPOSE 3002
CMD ["bun", "run", "server.ts"]