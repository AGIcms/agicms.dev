FROM node:22-bookworm as build

ARG SITE=boilerplate

ARG ROLE

ARG APP_SECRET
ENV APP_SECRET $APP_SECRET

ARG ENV_MODE
ENV ENV_MODE $ENV_MODE

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

ARG SUDO_PASSWORD
ENV SUDO_PASSWORD $SUDO_PASSWORD

ARG AI_CHAT_API_URL
ENV AI_CHAT_API_URL $AI_CHAT_API_URL

ARG OPENAI_API_BASE_URL
ENV OPENAI_API_BASE_URL $OPENAI_API_BASE_URL

ARG OPENAI_DEFAULT_MODEL
ENV OPENAI_DEFAULT_MODEL $OPENAI_DEFAULT_MODEL

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY $OPENAI_API_KEY

ARG TILE_SERVER_URL
ENV TILE_SERVER_URL $TILE_SERVER_URL

RUN apt-get update

RUN apt-get install -y bash 
RUN apt-get install -y mc 
RUN apt-get install -y curl 
RUN apt-get install -y python3
RUN apt-get install -y make 
RUN apt-get install -y g++
RUN apt-get install -y git 
RUN apt-get install -y iputils-ping


WORKDIR /app/

COPY ./package.json ./package-lock.json ./
RUN npm ci --force

COPY . .


RUN npm i -g yarn --force

RUN yarn prisma:deploy
RUN yarn generate

RUN if [ "$ENV_MODE" = "production" ] ; then yarn build ; fi
