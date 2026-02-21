FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Toolchain for native module compilation during install/build.
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/app.js ./app.js
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 8080
CMD ["app.js"]
