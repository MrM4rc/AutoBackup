import { google } from "googleapis";

const auth = google.auth.OAuth2;

export type OAuth2Type = InstanceType<typeof auth>;
