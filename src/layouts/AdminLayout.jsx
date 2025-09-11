import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white flex flex-col">
        <Link to="/" className="p-4 font-bold">Admin Panel</Link>
        <nav className="flex-1">
          <Link to="/" className="block p-3 hover:bg-gray-700">Dashboard</Link>
          <Link to="/dishes" className="block p-3 hover:bg-gray-700">Dishes</Link>
          <Link to="/customers" className="block p-3 hover:bg-gray-700">Customers</Link>
          <Link to="/reports" className="block p-3 hover:bg-gray-700">Reports</Link>
          <Link to="/tables" className="block p-3 hover:bg-gray-700">Tables</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
