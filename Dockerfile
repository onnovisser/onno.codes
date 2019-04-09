FROM node:10 AS builder

COPY . .

RUN yarn && yarn build

FROM nginx:alpine
COPY --from=builder /public /usr/share/nginx/html
