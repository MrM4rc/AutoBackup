import { IncomingMessage, ServerResponse } from "http";
import { IRoute, IRouter, Method } from "../../interfaces/router";
import { HandlerType } from "../../types/general";

export class Router implements IRouter {
  constructor(private routes: IRoute[] = []) {}

  async callHandler(req: IncomingMessage, res: ServerResponse) {
    const url = this.getParsedUrl(req),
      handler = this.routes.find((value) => {
        let path = value.path,
          toSearch = url.pathname;

        path = path
          .replace(/\{.\}/g, ".+")
          .replace(/^\//, "")
          .replace(/\/$/, "");
        path = `^${path}$`;

        toSearch = toSearch.replace(/^\//, "").replace(/\/$/, "");

        const regex = new RegExp(path),
          result = toSearch.match(regex);

        return result !== null && req.method?.toLowerCase() === value.method;
      });

    if (handler) handler["handler"](req, res);

    if (!res.closed) res.end();
  }

  addRoute(path: string, handler: HandlerType, method: Method): void;
  addRoute(router: IRouter): void;
  addRoute(
    pathOrRouter: string | IRouter,
    handler?: HandlerType,
    method?: Method
  ) {
    if (pathOrRouter instanceof Object && "getRoutes" in pathOrRouter) {
      this.routes = this.routes.concat(pathOrRouter.getRoutes());
    } else if (typeof pathOrRouter === "string" && handler && method) {
      // ------------------------------------ //

      this.routes.push({
        path: pathOrRouter,
        handler,
        method,
      });

      // ------------------------------------ //
    }
  }

  getRoutes() {
    return this.routes;
  }

  private getParsedUrl(req: IncomingMessage) {
    const parsed = new URL(req.url ?? "", `http://${req.headers.host}`);

    return parsed;
  }
}
