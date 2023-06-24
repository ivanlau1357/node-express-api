FROM node:20.3-slim

WORKDIR /app

COPY package.json /app

COPY yarn.lock /app

RUN cd /app \
    && apt-get update \
    && npm install -g nodemon \
    && yarn install

EXPOSE 5000

COPY . /app

CMD ["npm", "run", "start"]