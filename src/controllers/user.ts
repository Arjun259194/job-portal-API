import UserRepo from "../lib/database/user";

import { Request, Response } from "express";

export default class UserCtrl {
  constructor(private repo: UserRepo) {}

  async profile(req: Request, res: Response) {
    throw new Error("Not implemented yet!");
  }
}
