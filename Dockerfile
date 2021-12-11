FROM node:14.18.2-alpine3.14

COPY . .

RUN apk add --update git \
&& npm install \
&& npm run build api

WORKDIR /dist

EXPOSE 8080

CMD ["node", "apps/api/main.js"]
