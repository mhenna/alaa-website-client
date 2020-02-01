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

## Copy our default nginx config
# COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app/dist/alaa-website/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]