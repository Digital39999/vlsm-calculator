FROM node:20.3.0-alpine3.18

WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install

CMD ["pnpm", "run", "rebuild"]
