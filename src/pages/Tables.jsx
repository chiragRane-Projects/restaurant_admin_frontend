import React, { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { Trash2, Loader2, Plus, User, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [formData, setFormData] = useState({
    tableNo: "",
    seatingCap: 2,
    isAvailable: true,
  });
  const { token } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Log API_BASE for debugging
  console.log("API_BASE:", API_BASE);

  const validateResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.slice(0, 100)); // Log first 100 chars of response
      throw new Error(
        `Invalid response: Expected JSON but received ${contentType || "unknown content type"} (Status: ${response.status})`
      );
    }
    return response.json();
  };

  const fetchTables = async () => {
    setLoading(true);
    try {
      console.log("Fetching tables from:", `${API_BASE}/api/tables`);
      const res = await fetch(`${API_BASE}/api/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await validateResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to fetch tables");
      setTables(data.tables || []);
    } catch (error) {
      console.error("Fetch tables error:", error);
      toast.error(
        error.message || "Failed to connect to the server. Please verify the API URL and server status."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTables();
    } else {
      console.warn("No authentication token found");
      toast.error("Authentication token missing. Please log in.");
    }
  }, [token]);

  const deleteTable = async (id) => {
    try {
      console.log("Deleting table:", id);
      const res = await fetch(`${API_BASE}/api/tables/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await validateResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to delete table");
      toast.success("Table deleted successfully");
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete table error:", error);
      toast.error(error.message || "Failed to delete table. Please check the server.");
    } finally {
      setDeleteId(null);
    }
  };

  const updateTableAvailability = async (id, isAvailable) => {
    try {
      console.log("Updating availability for table:", id, "to:", isAvailable);
      const res = await fetch(`${API_BASE}/api/tables/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable }),
      });
      const data = await validateResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to update table availability");
      toast.success(`Table ${isAvailable ? "marked as available" : "marked as reserved"}`);
      setTables((prev) =>
        prev.map((table) =>
          table._id === id ? { ...table, isAvailable } : table
        )
      );
    } catch (error) {
      console.error("Update availability error:", error);
      toast.error(error.message || "Failed to update availability. Please check the server.");
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating table with data:", formData);
      const res = await fetch(`${API_BASE}/api/tables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await validateResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to create table");
      toast.success("Table created successfully");
      setModalOpen(null);
      setFormData({ tableNo: "", seatingCap: 2, isAvailable: true });
      fetchTables();
    } catch (error) {
      console.error("Create table error:", error);
      toast.error(error.message || "Failed to create table. Please check the server.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tableNo" || name === "seatingCap" ? parseInt(value) || "" : value,
    }));
  };

  return (
    <main className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800">Tables</h2>
        <Button
          onClick={() => setModalOpen("create")}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900"
          disabled={!token}
        >
          <Plus size={18} /> Add Table
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
        </div>
      ) : tables.length === 0 ? (
        <p className="text-zinc-500 text-center">No tables found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <article key={table._id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {table.seatingCap > 1 ? (
                      <Users className="w-6 h-6 text-zinc-700" />
                    ) : (
                      <User className="w-6 h-6 text-zinc-700" />
                    )}
                    Table {table.tableNo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">Seating Capacity: {table.seatingCap}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Label htmlFor={`availability-${table._id}`}>Status:</Label>
                    <Switch
                      id={`availability-${table._id}`}
                      checked={table.isAvailable}
                      onCheckedChange={() => updateTableAvailability(table._id, !table.isAvailable)}
                      disabled={!token}
                    />
                    <span className="text-zinc-600">
                      {table.isAvailable ? "Available" : "Reserved"}
                    </span>
                  </div>
                  {table.reservation && !table.isAvailable && (
                    <p className="text-zinc-600 mt-2">
                      Reserved from: {new Date(table.reservation.from).toLocaleString()} to{" "}
                      {new Date(table.reservation.to).toLocaleString()}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => setDeleteId(table._id)}
                    disabled={!token}
                  >
                    <Trash2 size={18} className="mr-2" /> Delete
                  </Button>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this table? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTable(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={modalOpen === "create"} onOpenChange={() => setModalOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTable} className="space-y-4">
            <div>
              <Label htmlFor="tableNo">Table Number</Label>
              <Input
                id="tableNo"
                name="tableNo"
                type="number"
                value={formData.tableNo}
                onChange={handleInputChange}
                required
                placeholder="Enter table number"
              />
            </div>
            <div>
              <Label htmlFor="seatingCap">Seating Capacity</Label>
              <Input
                id="seatingCap"
                name="seatingCap"
                type="number"
                value={formData.seatingCap}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Enter seating capacity"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!token}>Create Table</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}