FROM node:8-alpine

WORKDIR /app

ADD package.json .
RUN npm install --production

ADD . .

EXPOSE 9090

CMD npm start
