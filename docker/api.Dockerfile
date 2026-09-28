FROM node:22-alpine
WORKDIR /workspace
COPY package.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY services ./services
RUN npm install
RUN npm run build -w @orders-hub/api
ENV NODE_ENV=production
CMD ["sh", "-c", "npm run db:push -w @orders-hub/api && npm run db:seed -w @orders-hub/api && npm run start -w @orders-hub/api"]
