import type { ApiErrorDetail } from "@forgeai/types";

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details: ApiErrorDetail[] = [{ code, message }]
  ) {
    super(message);
    this.name = new.target.name;
  }
}
