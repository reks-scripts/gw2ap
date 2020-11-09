FROM node:alpine

RUN apk update && apk add python make g++

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install

# Bundle app source
COPY . .

# Build
RUN npm run build

EXPOSE 3000

# When running on Windows, use ENTRYPOINT and comment out CMD
# ENTRYPOINT [ "npm", "start" ]
CMD [ "npm", "start" ]