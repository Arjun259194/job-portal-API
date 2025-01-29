import { PrismaClient, User } from "@prisma/client";
import { Optional } from "../../types";

type UpdateUserData = Optional<Omit<User, "id">>;

export default class UserRepo {
  constructor(private prisma: PrismaClient) {}

  async find(id: string) {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async update(id: string, updates: UpdateUserData) {
    const obj = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );
    return await this.prisma.user.update({ where: { id }, data: obj });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
