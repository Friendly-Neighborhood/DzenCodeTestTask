FROM node:22-alpine
WORKDIR /workspace
COPY package.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY services ./services
RUN npm install
ARG WORKSPACE
ENV WORKSPACE=$WORKSPACE
RUN npm run build -w "$WORKSPACE"
ENV NODE_ENV=production
CMD ["sh", "-c", "npm run start -w \"$WORKSPACE\""]
