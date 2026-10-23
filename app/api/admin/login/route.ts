
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; startedAt: number }>();

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const now = Date.now();
  const record = attempts.get(ip);

  // Limit failed login attempts.
  if (
    record &&
    now - record.startedAt < 15 * 60_000 &&
    record.count >= 8
  ) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  // Parse the request body.
  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  // Read admin credentials from .env.local.
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  // Check server configuration.
  if (!configuredEmail || !configuredPassword || !sessionSecret) {
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 503 }
    );
  }

  // Validate credentials.
  const passwordOkay =
    password.length > 0 &&
    password.length <= 1024 &&
    password === configuredPassword;

  if (email !== configuredEmail || !passwordOkay) {
    if (!record || now - record.startedAt >= 15 * 60_000) {
      attempts.set(ip, { count: 1, startedAt: now });
    } else {
      attempts.set(ip, {
        ...record,
        count: record.count + 1,
      });
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Successful login.
  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });

  response.cookies.set(
    ADMIN_COOKIE,
    createAdminSession(configuredEmail),
    adminCookieOptions
  );

  return response;
}
