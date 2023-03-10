FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000 4001

CMD ["npm", "run", "dev"]