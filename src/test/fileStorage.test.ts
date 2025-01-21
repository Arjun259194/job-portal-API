import { decrypt } from "dotenv";
import env from "../env";
import S3FileService from "../lib/fileStorage";

beforeAll(() => {
  env();
  jest.spyOn(console, "error").mockImplementation(() => { }); // Mock console.error
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore(); // Cast to jest.Mock and restore the original function
});

describe("File Storage Test", () => {
  const { S3_SECRET_KEY, S3_ACCESS_KEY, S3_NAME, S3_REGION } = process.env;
  const s3 = new S3FileService({
    s3AccessKey: S3_ACCESS_KEY,
    s3SecretKey: S3_SECRET_KEY,
    s3Region: S3_REGION,
    s3Name: S3_NAME,
  });
});
