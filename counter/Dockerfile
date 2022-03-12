FROM node:15.6

WORKDIR /app

COPY package.json ./
RUN npm install
COPY src ./src

EXPOSE 3000

CMD [ "npm", "run", "start"]