import type { RoleSummary } from "@forgeai/types";

import { RolesRepository } from "./roles.repository.js";

export class RolesService {
  constructor(private readonly rolesRepository = new RolesRepository()) {}

  async listRoles(): Promise<RoleSummary[]> {
    const roles = await this.rolesRepository.listRoles();

    return roles.map((role) => ({
      description: role.description,
      id: role.id,
      name: role.name,
      permissions: role.permissions
        .filter((rolePermission) => !rolePermission.permission.deletedAt)
        .map((rolePermission) => rolePermission.permission.key)
    }));
  }
}
