import { NextRequest } from "next/server";

export function getBaseUrl(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  const protocol =
    req.headers.get("x-forwarded-proto") ??
    (process.env.VERCEL_ENV === "production" ? "https" : "http");
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${protocol}://${host}`;
}

