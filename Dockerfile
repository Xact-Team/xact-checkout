FROM node:14.18.2-bullseye-slim AS build

COPY . .

RUN npm install -g @angular/cli@12.2.1 \
&& npm install \
&& npm run build api

WORKDIR /dist

EXPOSE 8080

CMD ["node", "apps/api/main.js"]
