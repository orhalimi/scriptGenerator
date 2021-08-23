FROM node:12-stretch

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY package*.json ./

RUN npm ci

COPY . .

CMD npm run start