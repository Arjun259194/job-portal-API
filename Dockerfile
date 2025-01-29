FROM node:18 

WORKDIR /app 

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm &&  pnpm install 

COPY . .

RUN pnpm prisma

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "pnpm", "start" ]
