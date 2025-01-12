FROM node:16-alpine as Build

WORKDIR /usr/src
COPY ["package.json", "yarn.lock", "tsconfig.json", "./"]

RUN yarn install

COPY [".", "./"]
RUN yarn run build


FROM node:16-alpine as Run

WORKDIR /usr/prod
COPY --from=Build ["/usr/src/.output", "."]

# Add curl for healthcheck
RUN apk add --no-cache curl

ENV HOST=0.0.0.0
ENV PORT=80

EXPOSE 80
ENTRYPOINT ["node", "server/index.mjs"]