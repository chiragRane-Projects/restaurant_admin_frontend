import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Utensils, Users, FileText, Table2, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/dishes", label: "Dishes", icon: Utensils },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/tables", label: "Tables", icon: Table2 },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50 p-2"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Lords Admin</span>
          </Link>
          <Button
            variant="ghost"
            className="lg:hidden p-2 text-white"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </Button>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
              <AvatarFallback>
                {user?.username ? user.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {user?.username || "Admin User"}
              </p>
              <Button
                variant="link"
                className="p-0 text-xs text-zinc-400 hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-4">Lords Admin Panel v1.0</p>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto lg:ml-0 mt-16 lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
}