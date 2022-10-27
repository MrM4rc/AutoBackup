import { IncomingMessage, ServerResponse } from "http";
import { DEFAULT_SCOPES } from "../constants/scopes";
import { injector } from "../helpers/injector";
import { OAuth2Type } from "../types/google";

export class AuthController {
  static async auth(
    req: IncomingMessage,
    res: ServerResponse,
    oAuthClient: OAuth2Type = injector.inject("authClient")
  ) {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.write(
      `<b>Access: </b><a href="${oAuthClient.generateAuthUrl({
        scope: DEFAULT_SCOPES,
      })}">auth</a>`
    );
  }
}
