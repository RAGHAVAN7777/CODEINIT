import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const requiredConfig = [
  "B2_S3_ENDPOINT",
  "B2_REGION",
  "B2_KEY_ID",
  "B2_APPLICATION_KEY",
  "B2_BUCKET_NAME"
];

const sanitizeFileName = (fileName = "file") => {
  return fileName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
};

const hasConfig = () => requiredConfig.every((key) => Boolean(process.env[key]));

const getClient = () => {
  if (!hasConfig()) {
    throw new Error("Backblaze B2 configuration is incomplete");
  }

  return new S3Client({
    endpoint: process.env.B2_S3_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY
    }
  });
};

const buildPublicUrl = (fileKey) => {
  if (process.env.B2_PUBLIC_BASE_URL) {
    return `${process.env.B2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${fileKey}`;
  }

  const endpoint = process.env.B2_S3_ENDPOINT.replace(/\/$/, "");
  return `${endpoint}/${process.env.B2_BUCKET_NAME}/${fileKey}`;
};

export const uploadFileToBackblaze = async (file) => {
  if (!file?.buffer) {
    throw new Error("No file buffer found for upload");
  }

  const fileKey = `notes/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.originalname)}`;
  const client = getClient();

  await client.send(new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  return {
    key: fileKey,
    url: buildPublicUrl(fileKey)
  };
};

export const deleteFileFromBackblaze = async (fileKey) => {
  if (!fileKey || !hasConfig()) return;

  const client = getClient();

  await client.send(new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileKey
  }));
};
