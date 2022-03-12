FROM node:15.6

WORKDIR /app

COPY package.json ./
RUN npm install
COPY src ./src
COPY public ./public

EXPOSE 4000

CMD [ "npm", "run", "start"]