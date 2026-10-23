
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { orderSchema, contactSchema } from "@/lib/validation";
import { getPackage } from "@/lib/products";

export const runtime = "nodejs";

const globalForPg = globalThis as typeof globalThis & {
  orderPool?: Pool;
};

function getPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalForPg.orderPool) {
    globalForPg.orderPool = new Pool({
      connectionString,
      max: 5,
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalForPg.orderPool;
}

const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anon";
  const now = Date.now();

  const recent = (hits.get(ip) || []).filter(
    (time) => now - time < 600_000
  );

  if (recent.length >= 5) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  hits.set(ip, [...recent, now]);

  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const result = (
    body.kind === "contact" ? contactSchema : orderSchema
  ).safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid input.",
        issues: result.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  try {
    const data = result.data;
    let price: number | null = null;
    let originalPrice: number | null = null;
    let currency: string | null = null;

    if (data.kind === "order") {
      const product = getPackage(data.package);

      if (!product) {
        return NextResponse.json(
          { error: "Invalid package." },
          { status: 422 }
        );
      }

      price = Number(product.sale);
      originalPrice = Number(product.original);
      currency = "PHP";
    }

    const pool = getPool();

    const saved = await pool.query(
      `INSERT INTO orders
        (kind, customer_data, price, original_price, currency)
       VALUES ($1, $2::jsonb, $3, $4, $5)
       RETURNING id, status, created_at`,
      [
        data.kind,
        JSON.stringify({
          ...data,
          receivedAt: new Date().toISOString(),
        }),
        price,
        originalPrice,
        currency,
      ]
    );

    return NextResponse.json(
      { ok: true, order: saved.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order database error:", error);

    return NextResponse.json(
      { error: "Could not save your submission." },
      { status: 500 }
    );
  }
}
