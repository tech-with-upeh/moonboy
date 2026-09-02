import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { getB2Bucket, getB2Client, getB2PublicUrl } from "@/lib/b2";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 400 });

    const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const key = `posts/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
    const body = Buffer.from(await file.arrayBuffer());

    await getB2Client().send(new PutObjectCommand({
      Bucket: getB2Bucket(),
      Key: key,
      Body: body,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }));

    return NextResponse.json({ ok: true, key, url: getB2PublicUrl(key) }, { status: 201 });
  } catch (error) {
    console.error("B2 image upload failed", error);
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}
