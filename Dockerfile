FROM node:alpine
WORKDIR /app/src

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src ./src
COPY ./.env ./
COPY ./tsconfig.json ./

CMD ["npm" , "start"]