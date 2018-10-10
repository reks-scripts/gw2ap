
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm run build

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]