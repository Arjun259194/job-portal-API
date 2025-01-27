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
  private imageUrlExpireIn: number = 3600; /// in seconds
  private name: string;

  private configScheme = z.object({
    secretKey: z.string().nonempty(),
    accessKey: z.string().nonempty(),
    name: z.string().nonempty(),
    region: z.string().nonempty(),
  });

  constructor(config: z.infer<typeof this.configScheme>) {
    this.configScheme.parse(config);

    this.client = new S3Client({
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      region: config.region,
    });
    this.name = config.name;
  }

  private uniqueFileName = (byte = 16) =>
    crypto.randomBytes(byte).toString("hex");

  public setUrlExpire = (sec: number) => {
    this.imageUrlExpireIn = sec;
    return this;
  };

  public async put(file: Buffer, type: string): Promise<string> {
    try {
      const fileName = this.uniqueFileName();

      const command = new PutObjectCommand({
        Bucket: this.name,
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
        Bucket: this.name,
        Key: fileKey,
      });

      return await getSignedUrl(this.client, command, {
        expiresIn: this.imageUrlExpireIn,
      });
    } catch (error) {
      console.error(`Error while fetching and creating URL for file: ${error}`);
      throw new Error("Failed to get file from File Storage");
    }
  }

  public async delete(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.name,
        Key: fileKey,
      });

      await this.client.send(command);
    } catch (error) {
      console.error(`Error while deleting file in S3: ${error}`);
      throw new Error("Failed to delete file from File Storage");
    }
  }
}
