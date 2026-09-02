import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent } from "https";
const endpoint = process.env.B2_ENDPOINT;
const region = process.env.B2_REGION;
const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APP_KEY;

let b2Client: S3Client | null = null;

export function getB2Client() {
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("Backblaze B2 storage is not configured.");
  }

  if (!b2Client) {
    b2Client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      requestHandler: new NodeHttpHandler({
        httpsAgent: new Agent({ family: 4 }), // force IPv4, this network's IPv6 is unreachable
      }),
    });
  }

  return b2Client;
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
