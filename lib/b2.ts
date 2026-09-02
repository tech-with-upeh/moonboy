import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.B2_ENDPOINT;
const region = process.env.B2_REGION;
const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APP_KEY;

if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
  // The client is created lazily by getB2Client so normal app routes can still boot
  // when B2 has not been configured yet.
}

export function getB2Client() {
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("Backblaze B2 storage is not configured.");
  }
  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getB2PublicUrl(key: string) {
  const host = process.env.NEXT_PUBLIC_IMAGE_HOST;
  if (!host) throw new Error("NEXT_PUBLIC_IMAGE_HOST is not configured.");
  return `https://${host}/${key}`;
}

export function getB2Bucket() {
  const bucket = process.env.B2_BUCKET;
  if (!bucket) throw new Error("B2_BUCKET is not configured.");
  return bucket;
}
