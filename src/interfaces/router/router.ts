import { IncomingMessage, ServerResponse } from "http";
import { HandlerType } from "../../types/general";

export enum Method {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
}

export interface IRoute {
  path: string;
  handler: HandlerType;
  method: Method;
}

export interface IRouter {
  callHandler(req: IncomingMessage, res: ServerResponse): void | Promise<void>;
  addRoute(path: string, handler: HandlerType, method: Method): void;
  addRoute(router: IRouter): void;
  getRoutes(): IRoute[];
}
