FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api

# npm ci fails due to some conflict between package.json and package-lock.json,
# running npm install first fixes that. might not be ideal.
RUN npm install

RUN npm ci

RUN CI=true npm test

RUN npm run build


FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html