
"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  ArrowUpRight as OpenIcon,
} from "lucide-react";

type Order = {
  id: string | number;
  kind: string;
  customer_data: Record<string, unknown> | null;
  price: string | number | null;
  original_price: string | number | null;
  currency: string | null;
  status: string | null;
  created_at: string;
};

const STATUSES = [
  { value: "pending", label: "New inquiry" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const money = (value: unknown, currency: unknown = "PHP") => {
  const number = Number(value);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(number)
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency:
      typeof currency === "string" && /^[A-Z]{3}$/.test(currency)
        ? currency
        : "PHP",
    maximumFractionDigits: 0,
  }).format(number);
};

const dateText = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const textValue = (value: unknown, fallback = "—") =>
  typeof value === "string" && value.trim() ? value : fallback;

const statusLabel = (status: string | null) =>
  STATUSES.find((item) => item.value === status)?.label ??
  status ??
  "New inquiry";

export default function AdminDashboard({
  adminEmail,
}: {
  adminEmail: string;
}) {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [toast, setToast] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load orders."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return orders.filter((order) => {
      const data = order.customer_data ?? {};

      const matchesQuery =
        !needle ||
        [
          order.id,
          data.name,
          data.email,
          data.mobile,
          data.displayName,
          data.package,
          data.profileType,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(needle)
        );

      const matchesStatus =
        statusFilter === "all" ||
        (order.status || "pending") === statusFilter;

      const matchesKind =
        kindFilter === "all" || order.kind === kindFilter;

      return matchesQuery && matchesStatus && matchesKind;
    });
  }, [orders, query, statusFilter, kindFilter]);

  const counts = useMemo(
    () => ({
      total: orders.length,
      new: orders.filter(
        (order) => !order.status || order.status === "pending"
      ).length,
      active: orders.filter((order) =>
        ["reviewing", "contacted", "in_progress"].includes(
          order.status || ""
        )
      ).length,
      completed: orders.filter(
        (order) => order.status === "completed"
      ).length,
      revenue: orders
        .filter(
          (order) =>
            order.kind === "order" &&
            ["in_progress", "completed"].includes(order.status || "")
        )
        .reduce((sum, order) => sum + Number(order.price || 0), 0),
    }),
    [orders]
  );

  async function updateStatus(order: Order, status: string) {
    setSavingId(order.id);
    setToast("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update status.");
      }

      setOrders((current) =>
        current.map((item) =>
          String(item.id) === String(order.id)
            ? { ...item, status }
            : item
        )
      );

      setSelected((current) =>
        current && String(current.id) === String(order.id)
          ? { ...current, status }
          : current
      );

      setToast("Order status updated successfully.");
    } catch (error) {
      setToast(
        error instanceof Error
          ? error.message
          : "Could not update status."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    }).catch(() => undefined);

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="dashboard">
      <div className="dashboard-inner">
        <header className="welcome-row">
          <div className="brand-mark" aria-label="LHIMF">
            L
          </div>

          <div className="welcome-copy">
            <span className="eyebrow">LHIMF / ADMINISTRATION</span>
            <h1>Dashboard overview</h1>
            <p>
              Manage your customer inquiries and keep every project moving.
            </p>
          </div>

          <div className="header-actions">
            <div className="admin-identity">
              <span className="identity-avatar">
                {adminEmail.slice(0, 1).toUpperCase()}
              </span>
              <span className="identity-text">
                <b>Administrator</b>
                <small>{adminEmail}</small>
              </span>
            </div>

            <button
              className="logout-button"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={17} />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <section className="overview-heading">
          <div>
            <div className="live-indicator">
              <span />
              ADMIN WORKSPACE
            </div>
            <h2>Your business at a glance.</h2>
            <p>Here’s the latest activity across your submissions.</p>
          </div>

          <button
            className="refresh-button"
            onClick={() => void loadOrders()}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />
            Refresh data
          </button>
        </section>

        {error && (
          <div className="alert-box" role="alert">
            <b>Unable to load inquiries</b>
            <span>{error}</span>
            <small>
              Check your database configuration and existing orders table.
            </small>
          </div>
        )}

        {toast && (
          <div className="toast-message" role="status">
            <span>{toast}</span>
            <button
              onClick={() => setToast("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="stats-grid" aria-label="Order statistics">
          <Stat
            icon={<FileText size={20} />}
            label="Total inquiries"
            value={counts.total.toLocaleString("en-PH")}
            hint="All submissions received"
          />
          <Stat
            icon={<Clock3 size={20} />}
            label="New inquiries"
            value={counts.new.toLocaleString("en-PH")}
            hint="Awaiting your review"
            accent={counts.new > 0}
          />
          <Stat
            icon={<Activity size={20} />}
            label="In progress"
            value={counts.active.toLocaleString("en-PH")}
            hint="Currently being handled"
          />
          <Stat
            icon={<CheckCircle2 size={20} />}
            label="Completed"
            value={counts.completed.toLocaleString("en-PH")}
            hint="Successfully completed"
          />
        </section>

        <section className="revenue-card">
          <div className="revenue-symbol">
            <CircleDollarSign size={25} />
          </div>
          <div className="revenue-copy">
            <span>Active and completed order value</span>
            <strong>{money(counts.revenue)}</strong>
            <small>
              Based on saved package prices, not collected payments.
            </small>
          </div>
          <div className="revenue-side">
            <span className="revenue-side-label">TRACKING</span>
            <b>{counts.active + counts.completed} orders</b>
            <small>In progress or completed</small>
          </div>
        </section>

        <section className="orders-section" id="orders">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CUSTOMER MANAGEMENT</span>
              <h2>Order inquiries</h2>
              <p>Review customer submissions and manage their status.</p>
            </div>
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          <div className="filter-panel">
            <div className="search-field">
              <Search size={18} />
              <input
                aria-label="Search inquiries"
                placeholder="Search name, email, package..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by submission type"
              value={kindFilter}
              onChange={(event) => setKindFilter(event.target.value)}
            >
              <option value="all">All submissions</option>
              <option value="order">Order inquiries</option>
              <option value="contact">Contact messages</option>
            </select>
          </div>

          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Package / type</th>
                  <th>Submitted</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th> </th>
                </tr>
              </thead>

              <tbody>
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-state">
                      <RefreshCw className="spin" size={20} />
                      <span>Loading your inquiries...</span>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-state">
                      <div className="empty-icon">
                        <Users size={23} />
                      </div>
                      <b>No inquiries found</b>
                      <span>
                        {orders.length
                          ? "Try changing your search or filters."
                          : "New customer submissions will appear here."}
                      </span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const data = order.customer_data ?? {};
                    const status = order.status || "pending";

                    return (
                      <tr key={String(order.id)}>
                        <td>
                          <button
                            className="customer-cell"
                            onClick={() => setSelected(order)}
                          >
                            <span className="customer-avatar">
                              {textValue(data.name, "?")
                                .slice(0, 1)
                                .toUpperCase()}
                            </span>
                            <span className="customer-copy">
                              <b>
                                {textValue(data.name, "Unknown customer")}
                              </b>
                              <small>{textValue(data.email)}</small>
                            </span>
                          </button>
                        </td>

                        <td>
                          <b className="package-name">
                            {order.kind === "contact"
                              ? "Contact message"
                              : textValue(data.package, "Order inquiry")}
                          </b>
                          <small className="secondary-text">
                            {textValue(
                              data.profileType,
                              order.kind === "contact"
                                ? "General inquiry"
                                : "Profile"
                            )}
                          </small>
                        </td>

                        <td className="date-cell">
                          {dateText(order.created_at)}
                        </td>

                        <td>
                          <b className="price-value">
                            {order.kind === "contact"
                              ? "—"
                              : money(order.price, order.currency)}
                          </b>
                          {order.original_price !== null &&
                            order.original_price !== undefined &&
                            Number(order.original_price) >
                              Number(order.price) && (
                              <small className="old-price">
                                {money(
                                  order.original_price,
                                  order.currency
                                )}
                              </small>
                            )}
                        </td>

                        <td>
                          <StatusPill status={status} />
                        </td>

                        <td>
                          <button
                            className="details-button"
                            onClick={() => setSelected(order)}
                          >
                            Details <OpenIcon size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="table-note">
            <ShieldCheck size={15} />
            <span>
              Customer information is private. Showing the latest available
              records. This form does not collect payment.
            </span>
          </div>
        </section>
      </div>

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onUpdate={(status) => void updateStatus(selected, status)}
          saving={savingId === selected.id}
        />
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f5f5f5;
          color: #111111;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .dashboard {
          min-height: 100vh;
          background: #f5f5f5;
          color: #111;
          padding: 36px 28px 64px;
        }

        .dashboard-inner {
          max-width: 1440px;
          margin: 0 auto;
        }

        .welcome-row {
          display: flex;
          align-items: center;
          gap: 17px;
          padding-bottom: 29px;
          border-bottom: 1px solid #dedede;
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 49px;
          height: 49px;
          flex-shrink: 0;
          background: #111;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          border-radius: 14px;
        }

        .welcome-copy {
          min-width: 0;
        }

        .eyebrow {
          display: block;
          color: #737373;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .welcome-copy h1 {
          margin: 5px 0 0;
          font-size: 21px;
          letter-spacing: -0.8px;
        }

        .welcome-copy p {
          margin: 5px 0 0;
          color: #777;
          font-size: 13px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-left: auto;
        }

        .admin-identity {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .identity-avatar {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          border: 1px solid #dcdcdc;
          border-radius: 50%;
          background: white;
          font-weight: 800;
        }

        .identity-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .identity-text b {
          font-size: 12px;
        }

        .identity-text small {
          max-width: 220px;
          overflow: hidden;
          color: #777;
          font-size: 11px;
          text-overflow: ellipsis;
        }

        .logout-button,
        .refresh-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          min-height: 41px;
          padding: 0 14px;
          border: 1px solid #dedede;
          border-radius: 9px;
          background: #fff;
          color: #191919;
          font-size: 12px;
          font-weight: 700;
          transition: background 160ms ease, border-color 160ms ease;
        }

        .logout-button:hover,
        .refresh-button:hover {
          border-color: #999;
          background: #f0f0f0;
        }

        .overview-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 37px 0 24px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5e5e5e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .live-indicator span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #111;
        }

        .overview-heading h2 {
          margin: 12px 0 7px;
          font-size: clamp(25px, 3vw, 34px);
          letter-spacing: -1.5px;
          line-height: 1.15;
        }

        .overview-heading p {
          margin: 0;
          color: #777;
          font-size: 13px;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .stat-card {
          min-width: 0;
          padding: 21px;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 2px 5px rgb(0 0 0 / 2%);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgb(0 0 0 / 4%);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #696969;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 1px solid #ededed;
          border-radius: 10px;
          background: #f7f7f7;
          color: #111;
        }

        .stat-value {
          display: block;
          margin-top: 23px;
          font-size: clamp(27px, 3vw, 35px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1;
        }

        .stat-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 13px;
          color: #777;
          font-size: 11px;
        }

        .stat-card.has-new .stat-icon {
          border-color: #111;
          background: #111;
          color: #fff;
        }

        .stat-card.has-new .stat-hint {
          color: #111;
          font-weight: 700;
        }

        .revenue-card {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 17px;
          padding: 22px 24px;
          border: 1px solid #202020;
          border-radius: 14px;
          background: #111;
          color: #fff;
        }

        .revenue-symbol {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border: 1px solid #454545;
          border-radius: 12px;
          background: #202020;
        }

        .revenue-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .revenue-copy > span {
          color: #c4c4c4;
          font-size: 12px;
        }

        .revenue-copy strong {
          font-size: 27px;
          letter-spacing: -0.8px;
        }

        .revenue-copy small,
        .revenue-side small {
          color: #a8a8a8;
          font-size: 10px;
          line-height: 1.5;
        }

        .revenue-side {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-left: auto;
          padding-left: 25px;
          border-left: 1px solid #393939;
        }

        .revenue-side-label {
          color: #aaa;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .revenue-side b {
          font-size: 14px;
        }

        .orders-section {
          margin-top: 43px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .section-heading h2 {
          margin: 8px 0 6px;
          font-size: 23px;
          letter-spacing: -0.8px;
        }

        .section-heading p {
          margin: 0;
          color: #777;
          font-size: 12px;
          line-height: 1.6;
        }

        .result-count {
          flex-shrink: 0;
          padding: 8px 11px;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
          background: white;
          color: #444;
          font-size: 11px;
          font-weight: 700;
        }

        .filter-panel {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 180px 190px;
          gap: 10px;
          margin-bottom: 14px;
        }

        .search-field {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          min-height: 44px;
          padding: 0 13px;
          border: 1px solid #dedede;
          border-radius: 9px;
          background: #fff;
          color: #777;
        }

        .search-field input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #111;
          font-size: 12px;
        }

        .search-field input::placeholder {
          color: #999;
        }

        .search-field button {
          display: grid;
          place-items: center;
          padding: 4px;
          border: 0;
          background: transparent;
          color: #777;
        }

        .filter-panel select,
        .detail-status-select {
          width: 100%;
          min-height: 44px;
          padding: 0 12px;
          border: 1px solid #dedede;
          border-radius: 9px;
          outline: none;
          background: #fff;
          color: #333;
          font-size: 12px;
        }

        .filter-panel select:focus,
        .detail-status-select:focus {
          border-color: #111;
        }

        .table-container {
          overflow-x: auto;
          border: 1px solid #e4e4e4;
          border-radius: 13px;
          background: #fff;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .orders-table th {
          padding: 15px 17px;
          border-bottom: 1px solid #e8e8e8;
          background: #fafafa;
          color: #777;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .orders-table td {
          padding: 16px 17px;
          border-bottom: 1px solid #eee;
          color: #222;
          font-size: 12px;
          vertical-align: middle;
        }

        .orders-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .orders-table tbody tr:hover:not(:has(.table-state)) {
          background: #fcfcfc;
        }

        .customer-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 180px;
          padding: 0;
          border: 0;
          background: transparent;
          text-align: left;
        }

        .customer-avatar {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border: 1px solid #e4e4e4;
          border-radius: 10px;
          background: #f5f5f5;
          color: #111;
          font-size: 13px;
          font-weight: 800;
        }

        .customer-copy,
        .orders-table td > .customer-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .customer-copy b,
        .package-name,
        .price-value {
          color: #171717;
          font-size: 12px;
          font-weight: 700;
        }

        .customer-copy small,
        .secondary-text,
        .old-price {
          display: block;
          margin-top: 5px;
          color: #888;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .date-cell {
          min-width: 125px;
          color: #666 !important;
          font-size: 11px !important;
          white-space: nowrap;
        }

        .old-price {
          text-decoration: line-through;
        }

        .details-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 10px;
          border: 1px solid #dedede;
          border-radius: 7px;
          background: white;
          color: #222;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .details-button:hover {
          border-color: #111;
          background: #111;
          color: #fff;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          max-width: 160px;
          padding: 7px 9px;
          border: 1px solid #e4e4e4;
          border-radius: 7px;
          background: #fafafa;
          color: #444;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #888;
        }

        .status-pill.status-completed {
          border-color: #cfcfcf;
          background: #f2f2f2;
          color: #111;
        }

        .status-pill.status-completed .status-dot {
          background: #111;
        }

        .status-pill.status-in_progress {
          border-color: #cfcfcf;
          background: #f5f5f5;
          color: #111;
        }

        .status-pill.status-in_progress .status-dot {
          background: #333;
        }

        .status-pill.status-pending {
          border-color: #d8d8d8;
          background: #fff;
          color: #111;
        }

        .status-pill.status-pending .status-dot {
          background: #111;
        }

        .status-pill.status-cancelled {
          background: #f1f1f1;
          color: #777;
        }

        .table-state {
          height: 190px;
          text-align: center !important;
          color: #777 !important;
        }

        .table-state > * {
          display: block;
          margin: 7px auto;
        }

        .table-state b {
          color: #222;
          font-size: 13px;
        }

        .table-state span {
          font-size: 11px;
        }

        .empty-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          margin: 0 auto 10px !important;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          background: #f8f8f8;
          color: #555;
        }

        .table-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 13px;
          color: #888;
          font-size: 10px;
          line-height: 1.6;
        }

        .alert-box {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin: 0 0 18px;
          padding: 16px;
          border: 1px solid #d7d7d7;
          border-radius: 10px;
          background: #fff;
          color: #222;
          font-size: 12px;
        }

        .alert-box small {
          color: #777;
        }

        .toast-message {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          padding: 13px 15px;
          border: 1px solid #ddd;
          border-radius: 9px;
          background: #fff;
          font-size: 12px;
        }

        .toast-message button {
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
        }

        .spin {
          animation: dashboard-spin 1s linear infinite;
        }

        @keyframes dashboard-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .detail-backdrop {
          position: fixed;
          z-index: 100;
          inset: 0;
          display: flex;
          justify-content: flex-end;
          background: rgb(0 0 0 / 42%);
          backdrop-filter: blur(3px);
        }

        .detail-panel {
          display: flex;
          flex-direction: column;
          width: min(520px, 100%);
          height: 100%;
          overflow-y: auto;
          background: #fff;
          box-shadow: -10px 0 45px rgb(0 0 0 / 10%);
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 28px;
          border-bottom: 1px solid #e7e7e7;
        }

        .detail-header h2 {
          margin: 9px 0 7px;
          font-size: 24px;
          letter-spacing: -0.8px;
        }

        .detail-header p:last-child {
          margin: 0;
          color: #777;
          font-size: 11px;
        }

        .detail-close {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border: 1px solid #e1e1e1;
          border-radius: 9px;
          background: white;
        }

        .detail-price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 22px 24px 0;
          padding: 18px;
          border: 1px solid #e5e5e5;
          border-radius: 11px;
          background: #fafafa;
        }

        .detail-price > div {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .detail-price small {
          color: #777;
          font-size: 11px;
        }

        .detail-price strong {
          font-size: 22px;
          letter-spacing: -0.6px;
        }

        .detail-price > div > span {
          color: #888;
          font-size: 10px;
        }

        .detail-fields {
          padding: 10px 24px 25px;
        }

        .detail-field {
          display: grid;
          grid-template-columns: 145px minmax(0, 1fr);
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #ededed;
        }

        .detail-field > span {
          color: #777;
          font-size: 11px;
          line-height: 1.6;
        }

        .detail-field p {
          margin: 0;
          color: #222;
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }

        .detail-actions {
          margin-top: auto;
          padding: 22px 24px;
          border-top: 1px solid #e7e7e7;
          background: #fafafa;
        }

        .detail-actions label {
          display: block;
          margin-bottom: 9px;
          font-size: 12px;
          font-weight: 700;
        }

        .detail-actions p {
          margin: 9px 0 17px;
          color: #777;
          font-size: 10px;
        }

        .done-button {
          width: 100%;
          min-height: 43px;
          border: 1px solid #111;
          border-radius: 8px;
          background: #111;
          color: white;
          font-size: 12px;
          font-weight: 700;
        }

        .done-button:hover {
          background: #333;
        }

        @media (max-width: 1000px) {
          .dashboard {
            padding: 25px 20px 45px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filter-panel {
            grid-template-columns: 1fr 1fr;
          }

          .search-field {
            grid-column: 1 / -1;
          }

          .orders-table {
            min-width: 850px;
          }
        }

        @media (max-width: 620px) {
          .dashboard {
            padding: 18px 13px 35px;
          }

          .welcome-row {
            flex-wrap: wrap;
            gap: 12px;
            padding-bottom: 20px;
          }

          .brand-mark {
            width: 43px;
            height: 43px;
          }

          .welcome-copy {
            flex: 1;
          }

          .welcome-copy h1 {
            font-size: 18px;
          }

          .welcome-copy p {
            font-size: 11px;
            line-height: 1.5;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
            margin-left: 0;
            padding-top: 8px;
          }

          .identity-text small {
            max-width: 190px;
          }

          .logout-button {
            min-height: 38px;
            padding: 0 10px;
          }

          .overview-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
            padding-top: 27px;
          }

          .overview-heading h2 {
            font-size: 27px;
          }

          .refresh-button {
            width: 100%;
          }

          .stats-grid {
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
            border-radius: 11px;
          }

          .stat-top {
            align-items: flex-start;
            font-size: 11px;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
          }

          .stat-value {
            margin-top: 18px;
            font-size: 29px;
          }

          .stat-hint {
            align-items: flex-start;
            font-size: 10px;
            line-height: 1.5;
          }

          .revenue-card {
            align-items: flex-start;
            gap: 12px;
            padding: 17px 14px;
          }

          .revenue-symbol {
            width: 39px;
            height: 39px;
          }

          .revenue-copy strong {
            font-size: 22px;
          }

          .revenue-copy small {
            max-width: 210px;
          }

          .revenue-side {
            display: none;
          }

          .orders-section {
            margin-top: 33px;
          }

          .section-heading {
            align-items: flex-start;
          }

          .section-heading h2 {
            font-size: 21px;
          }

          .section-heading p {
            max-width: 260px;
          }

          .result-count {
            padding: 7px 8px;
            font-size: 10px;
          }

          .filter-panel {
            grid-template-columns: 1fr;
          }

          .search-field {
            grid-column: auto;
          }

          .table-note {
            align-items: flex-start;
          }

          .detail-header {
            padding: 22px 18px;
          }

          .detail-price {
            margin: 18px 16px 0;
            padding: 14px;
          }

          .detail-fields {
            padding-right: 17px;
            padding-left: 17px;
          }

          .detail-field {
            grid-template-columns: 105px minmax(0, 1fr);
            gap: 10px;
          }

          .detail-actions {
            padding: 18px 17px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <article className={`stat-card ${accent ? "has-new" : ""}`}>
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-hint">
        {accent ? (
          <ArrowDownRight size={14} />
        ) : (
          <ArrowUpRight size={14} />
        )}
        <span>{hint}</span>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.replace(/[^a-z_]/g, "");

  return (
    <span className={`status-pill status-${normalized}`}>
      <i className="status-dot" />
      {statusLabel(status)}
    </span>
  );
}

function OrderDetail({
  order,
  onClose,
  onUpdate,
  saving,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (status: string) => void;
  saving: boolean;
}) {
  const data = order.customer_data ?? {};

  const fields: [string, unknown][] =
    order.kind === "contact"
      ? [
          ["Full name", data.name],
          ["Email", data.email],
          ["Message", data.message],
        ]
      : [
          ["Full name", data.name],
          ["Email", data.email],
          ["Mobile number", data.mobile],
          ["Profile type", data.profileType],
          ["Name on card", data.displayName],
          ["Package", data.package],
          ["Preferred card design", data.design],
          ["Contact & social media details", data.details],
          ["Additional notes", data.notes],
          [
            "Consent",
            data.consent === true
              ? "Consent provided"
              : "Not recorded",
          ],
        ];

  return (
    <div
      className="detail-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header className="detail-header">
          <div>
            <span className="eyebrow">
              SUBMISSION #{String(order.id)}
            </span>
            <h2 id="detail-title">Inquiry details</h2>
            <p>Received {dateText(order.created_at)}</p>
          </div>

          <button
            className="detail-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={19} />
          </button>
        </header>

        <div className="detail-price">
          <div>
            <small>
              {order.kind === "contact"
                ? "Submission type"
                : "Package price"}
            </small>
            <strong>
              {order.kind === "contact"
                ? "Contact message"
                : money(order.price, order.currency)}
            </strong>
            {order.original_price !== null &&
              order.original_price !== undefined &&
              Number(order.original_price) > Number(order.price) && (
                <span>
                  Original {money(order.original_price, order.currency)}
                </span>
              )}
          </div>

          <StatusPill status={order.status || "pending"} />
        </div>

        <div className="detail-fields">
          {fields.map(([label, value]) => (
            <div className="detail-field" key={label}>
              <span>{label}</span>
              <p>
                {value === null || value === undefined || value === ""
                  ? "Not provided"
                  : String(value)}
              </p>
            </div>
          ))}
        </div>

        <div className="detail-actions">
          <label htmlFor="detail-status-select">Update status</label>
          <select
            id="detail-status-select"
            className="detail-status-select"
            disabled={saving}
            value={order.status || "pending"}
            onChange={(event) => onUpdate(event.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <p>
            {saving
              ? "Saving status..."
              : "Status changes are saved to your orders database."}
          </p>

          <button className="done-button" onClick={onClose}>
            Done
          </button>
        </div>
      </section>
    </div>
  );
}
