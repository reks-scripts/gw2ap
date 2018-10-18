
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install

# Bundle app source
COPY . .

# Make build folder
RUN mkdir dist
# Build
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]