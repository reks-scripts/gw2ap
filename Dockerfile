FROM node:alpine

RUN apk update && apk add python2 make g++

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json

RUN npm install

# Bundle app source
COPY . /usr/app

# Build
RUN npm run build

EXPOSE 8080

# When running on Windows, use ENTRYPOINT and comment out CMD
#ENTRYPOINT [ "npm", "start" ]
CMD [ "npm", "start" ]