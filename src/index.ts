import express, { json, urlencoded } from "express";
import env from "./env";

env();

const server = express();

server.use(json());
server.use(urlencoded());

server.get("/health-check", (_, res) => {
  res.status(200).json({ message: `Server is running port: ${3000}` });
  return;
});

server.listen(3000);
