FROM oven/bun:alpine AS build

WORKDIR /usr/src
COPY ["package.json", "bun.lockb", "tsconfig.json", "./"]

RUN bun install --frozen-lockfile

COPY [".", "./"]
RUN bun run build


FROM oven/bun:alpine AS run

WORKDIR /usr/prod
COPY --from=build ["/usr/src/.output", "."]

# Add curl and wget for healthcheck
RUN apk add --no-cache curl wget

ENV HOST=0.0.0.0
ENV PORT=80

USER bun
EXPOSE 80
ENTRYPOINT ["bun", "run", "server/index.mjs"]