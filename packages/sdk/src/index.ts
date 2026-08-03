export interface ForgeClientOptions {
  baseUrl: string;
  accessToken?: string;
}

export class ForgeClient {
  constructor(private readonly options: ForgeClientOptions) {}

  async health() {
    const response = await fetch(`${this.options.baseUrl}/api/health`, {
      headers: this.options.accessToken
        ? { Authorization: `Bearer ${this.options.accessToken}` }
        : undefined
    });

    if (!response.ok) {
      throw new Error(`ForgeAI API health check failed: ${response.status}`);
    }

    return response.json() as Promise<{ ok: boolean; service: string }>;
  }
}
