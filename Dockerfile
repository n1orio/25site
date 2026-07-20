# Сборка приложения
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Запуск приложения
FROM oven/bun:latest AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
