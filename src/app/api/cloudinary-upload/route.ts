import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Missing Cloudinary config" }, { status: 500 });
    }
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("folder", "models");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: result.error?.message || "Upload failed" }, { status: 400 });
      }
      uploadedUrls.push(result.secure_url);
    }
    return NextResponse.json({ urls: uploadedUrls });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    let errorMessage = "Server error during upload";
    if (err instanceof Error) {
      errorMessage += ": " + err.message;
    } else if (typeof err === "string") {
      errorMessage += ": " + err;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
