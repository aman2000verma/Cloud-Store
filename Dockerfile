FROM node

WORKDIR /server

COPY ./server/package.json .

RUN npm install
RUN npm install pm2 -g

EXPOSE 5000

COPY ./server/ .

CMD ["npm", "start"]
