import "./load-env.js";

import { envSchema } from "./schema.js";

export const env = envSchema.parse(process.env);
