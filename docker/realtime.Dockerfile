FROM node:22-alpine
WORKDIR /workspace
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY services ./services
RUN npm install
RUN npm run build -w @orders-hub/realtime
ENV NODE_ENV=production
CMD ["npm", "run", "start", "-w", "@orders-hub/realtime"]
