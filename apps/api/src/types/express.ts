import type { AuthenticatedPrincipal } from "@forgeai/types";

declare global {
  // Express exposes request augmentation through namespace merging.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string;
      user?: AuthenticatedPrincipal;
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};
