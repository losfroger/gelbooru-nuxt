FROM node:16-alpine as Build

WORKDIR /usr/src
COPY ["package.json", "yarn.lock", "tsconfig.json", "./"]

RUN yarn install

COPY [".", "./"]
RUN yarn run build


FROM node:16-alpine as Run

WORKDIR /usr/prod
COPY ["package.json", "yarn.lock", "tsconfig.json", "./"]
COPY --from=Build ["/usr/src/.output", "."]

RUN yarn install

ENV HOST=0.0.0.0
ENV PORT=80

EXPOSE 80
ENTRYPOINT ["node", "server/index.mjs"]