FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
