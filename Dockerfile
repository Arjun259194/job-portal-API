FROM node:18 

WORKDIR /app 

COPY package.json pnpm-lock.yaml ./

RUN npm install 

COPY . .

RUN npm run prisma

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "npm", "run", "start" ]
