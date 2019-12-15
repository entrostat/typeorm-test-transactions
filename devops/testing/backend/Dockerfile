FROM node:lts

ENTRYPOINT ["npm"]
CMD ["start"]

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app
