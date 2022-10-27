import { IncomingMessage, ServerResponse } from "http";

export type HandlerType = (
  req: IncomingMessage,
  res: ServerResponse
) => unknown | Promise<unknown>;
