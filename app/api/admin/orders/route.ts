import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { getAdminPool } from "@/lib/admin-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const allowedStatuses = new Set(["pending", "reviewing", "contacted", "in_progress", "completed", "cancelled"]);

export async function GET(request: NextRequest) {
  if (!getAdminSessionFromRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const pool = getAdminPool();
    const result = await pool.query(
      `SELECT id, kind, customer_data, price, original_price, currency, status, created_at
       FROM orders ORDER BY created_at DESC LIMIT 500`
    );
    return NextResponse.json({ orders: result.rows });
  } catch (error) {
    console.error("Admin order list failed:", error);
    return NextResponse.json({ error: "Could not load orders. Check the existing orders table and database connection." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!getAdminSessionFromRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: { id?: unknown; status?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const id = typeof body.id === "string" || typeof body.id === "number" ? String(body.id) : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id || id.length > 128 || !allowedStatuses.has(status)) return NextResponse.json({ error: "Invalid order ID or status." }, { status: 422 });
  try {
    const result = await getAdminPool().query(
      `UPDATE orders SET status = $1 WHERE id::text = $2 RETURNING id, status`, [status, id]
    );
    if (!result.rowCount) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ ok: true, order: result.rows[0] });
  } catch (error) {
    console.error("Admin order update failed:", error);
    return NextResponse.json({ error: "Could not update order status." }, { status: 500 });
  }
}
