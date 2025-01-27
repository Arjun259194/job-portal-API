import { PrismaClient, User } from "@prisma/client";
import { z } from "zod";

class NewUserData {
  constructor() {
    const x = z.object({
      name: z.string(),
      email: z.string()
    }).omit({
      name: true
    })
  }

export class UserRepo {
  constructor(private prisma: PrismaClient) { }

  async new(data: UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async read(id: string) { }
}
