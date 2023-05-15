FROM node:18 as build
WORKDIR /app
COPY package*.json yarn.lock tsconfig.json ./
RUN yarn install

FROM node:18
WORKDIR /app
COPY --from=build /app ./
COPY prisma ./prisma
COPY src ./src 
CMD [ "yarn", "start" ]
EXPOSE 80