import express, { json, urlencoded } from "express";
import env from "./env";
import { UserRouter } from "./routes/user";
import { PrismaClient } from "@prisma/client";

env();
const server = express();
const prisma = new PrismaClient()

const userRouter = new UserRouter(prisma)

server.use(json());
server.use(urlencoded());

server.use("/user", userRouter.get())

server.get("/health-check", (_, res) => {
  res.status(200).json({ message: `Server is running port: ${3000}` });
  return;
});

server.listen(3000);
