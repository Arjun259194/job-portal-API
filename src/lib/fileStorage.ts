import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import z from "zod";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface FileService {
  put(file: Buffer<ArrayBufferLike>, type: string): Promise<string>;
  get(fileKey: string): Promise<string>;
  delete(fileKey: string): Promise<void>;
}

export default class S3FileService implements FileService {
  private client: S3Client;
  private ImageUrlExpireIn: number = 3600; /// in seconds
  private s3Name: string;

  private configScheme = z.object({
    s3SecretKey: z.string().nonempty(),
    s3AccessKey: z.string().nonempty(),
    s3Name: z.string().nonempty(),
    s3Region: z.string().nonempty(),
  });

  constructor(config: z.infer<typeof this.configScheme>) {
    this.configScheme.parse(config);

    this.client = new S3Client({
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey,
      },
      region: config.s3Region,
    });
    this.s3Name = config.s3Name;
  }

  private uniqueFileName = (byte = 16) =>
    crypto.randomBytes(byte).toString("hex");

  public setUrlExpire = (sec: number) => {
    this.ImageUrlExpireIn = sec;
    return this;
  };

  public async put(file: Buffer, type: string): Promise<string> {
    try {
      const fileName = this.uniqueFileName();

      const command = new PutObjectCommand({
        Bucket: this.s3Name,
        Body: file,
        ContentType: type,
        Key: fileName,
      });

      await this.client.send(command);
      return fileName;
    } catch (error) {
      console.error(`Error while uploading to s3: ${error}`);
      throw new Error("Failed to upload to File Storage");
    }
  }

  public async get(fileKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.s3Name,
        Key: fileKey,
      });

      return await getSignedUrl(this.client, command, {
        expiresIn: this.ImageUrlExpireIn,
      });
    } catch (error) {
      console.error(`Error while fetching and creating URL for file: ${error}`);
      throw new Error("Failed to get file from File Storage");
    }
  }

  public async delete(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.s3Name,
        Key: fileKey,
      });

      await this.client.send(command);
    } catch (error) {
      console.error(`Error while deleting file in S3: ${error}`);
      throw new Error("Failed to delete file from File Storage");
    }
  }
}
