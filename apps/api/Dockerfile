FROM node:14.18.2-alpine3.14

WORKDIR /app

COPY ./dist/apps/api .

RUN npm install --production
# dependencies that nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

EXPOSE 8080

CMD ["node", "./main.js"]
