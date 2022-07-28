import { google } from 'googleapis';
import { getOAuthCredentials } from './src/config/credentials';

const DEFAULT_SCOPES = ['https://www.googleapis.com/auth/drive'];


/**
 * The main functions
 */
async function main() {
  const credentials = await getOAuthCredentials(),
    oAuthClient = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0],
  ),
  authUrl = oAuthClient.generateAuthUrl({
    scope: DEFAULT_SCOPES,
    access_type: 'offline'
  });

  console.log(authUrl);
}

main();
