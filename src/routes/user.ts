import express from "express";
import UserRepo from "../lib/database/user";
import { PrismaClient } from "@prisma/client";
import UserCtrl from "../controllers/user";

export class UserRouter {
  private router = express.Router();
  constructor(prisma: PrismaClient) {
    const repo = new UserRepo(prisma);
    const ctrl = new UserCtrl(repo);
    this.router.get("/profile", ctrl.profile);
  }

  get = () => this.router;
}
