import fs from "fs/promises";

interface Credentials {
  "installed":
  {
    "client_id": string,
    "project_id": string,
    "auth_uri": string,
    "token_uri": string,
    "auth_provider_x509_cert_url": string,
    "client_secret": string,
    "redirect_uris": string[]
  }
}

/**
 * Get googleapi credentials for OAuth2
 */
export async function getOAuthCredentials(): Promise<Credentials> {
  return JSON.parse(await fs.readFile("credentials.json", { encoding: "utf-8" }));
}

export default {
  getOAuthCredentials,
};
