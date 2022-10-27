import { google } from "googleapis";
import http, { IncomingMessage, ServerResponse } from "http";
import { getOAuthCredentials } from "./src/config/credentials";
import { router } from "./src/routes";
import { injector } from "./src/helpers/injector";

const DEFAULT_PORT = 3688;

/**
 * The main functions
 */
async function main() {
  const credentials = await getOAuthCredentials(),
    oAuthClient = new google.auth.OAuth2(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      `http://localhost:${DEFAULT_PORT}/code`
    ),
    defaultListener = async (req: IncomingMessage, res: ServerResponse) => {
      router.callHandler(req, res);
    },
    server = http.createServer(defaultListener);

  injector.add("authClient", oAuthClient);

  server.listen(DEFAULT_PORT, () => {
    console.log(`Server is running on port ${DEFAULT_PORT}`);
  });
}

main();
