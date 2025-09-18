import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SummaryCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between h-full">
    <div className="flex items-start">
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">{value}</h3>
      </div>
    </div>
    {subtitle && <p className="mt-3 text-xs text-gray-400">{subtitle}</p>}
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [dietary, setDietary] = useState({ veg: 0, nonVeg: 0, eggetarian: 0 });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  const API_BASE =
    import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

  const token = localStorage.getItem("token"); // <-- JWT stored on login

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const [sRes, tRes, dRes] = await Promise.all([
          fetch(`${API_BASE}/api/analytics/stats/summary`, { headers }),
          fetch(`${API_BASE}/api/analytics/stats/revenue-trend?range=${range}`, { headers }),
          fetch(`${API_BASE}/api/analytics/stats/dietary-breakdown`, { headers }),
        ]);

        if (!sRes.ok || !tRes.ok || !dRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const sJson = await sRes.json();
        const tJson = await tRes.json();
        const dJson = await dRes.json();

        if (!mounted) return;

        setSummary(sJson); // backend already sends {todaySales, weekSales, monthSales, activeOrders, topDish}
        setTrend(tJson);
        setDietary(dJson);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, [range, token]);

  const pieData = [
    { name: "Veg", value: dietary.veg || 0, color: "#16a34a" },
    { name: "Non-Veg", value: dietary.nonVeg || 0, color: "#ef4444" },
    { name: "Eggetarian", value: dietary.eggetarian || 0, color: "#f97316" },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Quick overview of sales & orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">Range</div>
          <div className="flex gap-2">
            <Button variant={range === "7d" ? "default" : "ghost"} size="sm" onClick={() => setRange("7d")}>
              7d
            </Button>
            <Button variant={range === "30d" ? "default" : "ghost"} size="sm" onClick={() => setRange("30d")}>
              30d
            </Button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard title="Today's Sales" value={loading ? "..." : `₹${summary?.todaySales ?? 0}`} subtitle="Total sales today" />
        <SummaryCard title="This Week" value={loading ? "..." : `₹${summary?.weekSales ?? 0}`} subtitle="Last 7 days" />
        <SummaryCard title="This Month" value={loading ? "..." : `₹${summary?.monthSales ?? 0}`} subtitle="Current month" />
        <SummaryCard title="Active Orders" value={loading ? "..." : `${summary?.activeOrders ?? 0}`} subtitle="Pending / Preparing" />
        <SummaryCard title="Top Dish" value={loading ? "..." : `${summary?.topDish ?? "N/A"}`} subtitle="Most ordered item" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="col-span-2 h-72 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <div className="text-sm text-gray-500">Last {range === "7d" ? 7 : 30} days</div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#fb923c" strokeWidth={3} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dietary Pie */}
        <Card className="h-72 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Dietary Breakdown</h2>
            <div className="text-sm text-gray-500">Total items ordered</div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/2 h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e5e7eb" }]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {(pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e5e7eb" }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2 w-full md:w-1/2">
              {(pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e5e7eb" }]).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: d.color }} />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{d.name}</div>
                      <div className="text-xs text-gray-400">{d.value} items</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {Math.round((d.value / (pieData.reduce((s, x) => s + x.value, 0) || 1)) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
