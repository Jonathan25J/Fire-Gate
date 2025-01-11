FROM node:23.5

WORKDIR /bot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]