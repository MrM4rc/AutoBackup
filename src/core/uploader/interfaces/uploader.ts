export interface IUploader {
  /**
   * @description upload a set of files/folders.
   * @param uploadList a set of files/folders
   * @param parentID file/folder's parent ID.
   * @return An array of string with name of files that upload has been failed
   */
  bulkUpload(uploadList: string[], parentID?: string): Promise<string[]>;
  /**
   * @summary Upload a single file
   * @description Upload a single file and return successful state.
   *
   * this function doesn't accept folders.
   *
   * @return upload state
   */
  uploadFile(filePath: string, parentID?: string): Promise<boolean>;

  /**
   * @description Upload a entire folder
   * @return upload state
   */
  uploadFolder(path: string, parentID?: string): Promise<boolean>;
}
