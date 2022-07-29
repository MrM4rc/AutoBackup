import fs, { Dir } from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import { IUploader } from "./interfaces/uploader";
import { GaxiosResponse } from "gaxios";
import { FOLDER_MIMETYPE } from "../../constants/mime_types";

export class Uploader implements IUploader {
  private driveClient: drive_v3.Drive;

  constructor(oAuthClient: OAuth2Client) {
    this.driveClient = google.drive({
      version: "v3",
      auth: oAuthClient
    });
  }

  async uploadFile(filePath: string, parentID?: string): Promise<boolean> {
    let response: GaxiosResponse<drive_v3.Schema$File>,
      state = true,
      fileQuery = "",
      alreadyExists = false;
    const file = fs.createReadStream(filePath),
      fileName = path.basename(filePath),
      parents = parentID ? [parentID] : [];

    fileQuery += parentID ? `'${parentID}' in parents and name = ${fileName}` : `name = ${fileName}`;

    try {
      alreadyExists = ((await this.driveClient.files.list({
        q: fileQuery,
        fields: "files(id)",
      })).data?.files?.length ?? 0) > 0;

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

  async uploadFolder(folderPath: string, parentID?: string): Promise<boolean> {
    let state = true,
      folderID: string,
      folder: Dir;
    const folderName = path.basename(folderPath),
      parents = parentID ? [parentID] : [],
      folderItems: string[] = [];

    try {
      folderID = (await this.driveClient.files.list({
        q: `name = '${folderName}' and mimeType = '${FOLDER_MIMETYPE}'`,
        fields: "files(id)",
      })).data.files?.[0].id ?? "";

      if(folderID === "")
        folderID = (await this.driveClient.files.create({
          requestBody: {
            name: folderName,
            mimeType: FOLDER_MIMETYPE,
            parents,
          },
          fields: "id",
        })).data.id ?? "";

      folder = await fsPromises.opendir(folderPath);

      for await (const item of folder) {
        folderItems.push(path.join(folderPath, item.name));
      }

      await this.bulkUpload(folderItems, folderID);
    }
    catch (error: unknown) {
      // TODO: error log system
      console.log(error);
      state = false;
    }

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

  isFolder(filePath: string) {
    const stat = fs.statSync(filePath);
    return stat.isDirectory();
  }
}

export default {
  Uploader,
};
