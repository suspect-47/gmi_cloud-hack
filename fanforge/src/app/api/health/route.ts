import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      gmi: !!process.env.GMI_CLOUD_API_KEY,
      gemini: !!process.env.GOOGLE_AI_STUDIO_KEY,
      rocketride_host: process.env.ROCKETRIDE_HOST || "localhost",
    },
  });
}
