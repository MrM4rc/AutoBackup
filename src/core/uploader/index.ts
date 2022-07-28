import fs from "fs";
import path from "path";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import { IUploader } from "./interfaces/uploader";
import { GaxiosResponse } from "gaxios";

export class Uploader implements IUploader {
  private driveClient: drive_v3.Drive;

  constructor(oAuthClient: OAuth2Client) {
    this.driveClient = google.drive({
      version: "v3",
      auth: oAuthClient
    })
  }

  async uploadFile(filePath: string, parentID?: string): Promise<boolean> {
    let response: GaxiosResponse<drive_v3.Schema$File>,
      state = true;
    const file = fs.createReadStream(filePath),
      fileName = path.basename(filePath),
      parents = parentID ? [parentID] : [];

    try {
      response = await this.driveClient.files.create({
        requestBody: {
          name: fileName,
          parents,
        },
        media: {
          body: file,
        },
        fields: "id",
      });
    }
    catch(error: unknown) {
      // TODO: error log system.
      console.log(error);
      state = false;
    }

    return state;
  }

  async uploadFolder(path: string, parentID?: string): Promise<boolean> {
    let state: boolean = true;

    return state;
  }

  async bulkUpload(uploadList: string[], parentID?: string): Promise<string[]> {
    const failed: string[] = [];
    let uploadResult: boolean;
    for(const filePath of uploadList) {
      uploadResult =  this.isFolder(filePath) ?
        await this.uploadFolder(filePath, parentID) : await this.uploadFile(filePath, parentID);

      if(!uploadResult) failed.push(filePath);
    }

    return failed;
  }

  isFolder(path: string) {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  }
}