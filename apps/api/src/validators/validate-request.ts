import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";

export interface RequestValidationSchema {
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
}

export function validateRequest(schema: RequestValidationSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.validated = {
      body: schema.body?.parse(req.body),
      params: schema.params?.parse(req.params),
      query: schema.query?.parse(req.query)
    };
    next();
  };
}

export function getValidatedBody<T>(req: Request) {
  return req.validated?.body as T;
}

export function getValidatedParams<T>(req: Request) {
  return req.validated?.params as T;
}

export function getValidatedQuery<T>(req: Request) {
  return req.validated?.query as T;
}
