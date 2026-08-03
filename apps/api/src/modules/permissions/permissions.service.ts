import type { PermissionSummary } from "@forgeai/types";

import { PermissionsRepository } from "./permissions.repository.js";

export class PermissionsService {
  constructor(private readonly permissionsRepository = new PermissionsRepository()) {}

  async listPermissions(): Promise<PermissionSummary[]> {
    const permissions = await this.permissionsRepository.listPermissions();

    return permissions.map((permission) => ({
      description: permission.description,
      id: permission.id,
      key: permission.key
    }));
  }
}
