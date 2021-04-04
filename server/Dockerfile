FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# COPY index.js ./

# COPY ./db/db.js ./

# COPY ./routes/index.js ./

# COPY ./controllers ./controllers

COPY ./ ./

CMD ["node", "index.js"]