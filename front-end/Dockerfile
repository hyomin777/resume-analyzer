FROM node:20 AS builder
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf