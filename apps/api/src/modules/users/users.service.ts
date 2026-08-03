import type { PublicUser } from "@forgeai/types";

import { NotFoundError } from "../../errors/index.js";

import { UsersRepository } from "./users.repository.js";

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

  async listUsers() {
    const users = await this.usersRepository.listUsers();
    return users.map((user) => this.toPublicUser(user));
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.toPublicUser(user);
  }

  private toPublicUser(user: {
    createdAt: Date;
    email: string;
    id: string;
    name: string | null;
    updatedAt: Date;
  }): PublicUser {
    return {
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      id: user.id,
      name: user.name,
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
