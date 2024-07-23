FROM node:20 AS base
WORKDIR /app

FROM base AS deps-stage
COPY package.json package-lock.json ./
COPY src ./src
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
EXPOSE 33333

CMD [ "npm", "run", "dev" ]