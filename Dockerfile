### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm i -g @angular/cli

COPY . .

RUN ng build --prod

### STAGE 2: Setup ###

FROM nginx:1.14.1-alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## Copy our default nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/dist/alaa-website/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]