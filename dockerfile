# builder
FROM node:18-alpine AS bulder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# runtime
FROM node:18-alpine
WORKDIR /src
COPY --from=bulder /src/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/main.js"]