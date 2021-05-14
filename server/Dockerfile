FROM node:12-slim

WORKDIR /usr/src/server

COPY package*.json ./
RUN npm install --only=production
COPY . ./

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "npm", "run", "start" ]