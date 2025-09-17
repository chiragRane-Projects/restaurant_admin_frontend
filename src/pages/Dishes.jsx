import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/store/useAuth";
import CreateDishModal from "@/components/createDishModal";
import UpdateDishModal from "@/components/updateDishModal";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { token } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/dish`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch dishes");
      setDishes(data.dishes || []);
    } catch (error) {
      toast.error(error.message || "Server error while fetching dishes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/dish/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete dish");
      toast.success("Dish deleted");
      setDishes((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      toast.error(error.message || "Server error while deleting dish");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <section className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-800">Dishes</h2>
        <Button onClick={() => setModalOpen("create")} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900">
          <Plus size={18} /> Add Dish
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
        </div>
      ) : dishes.length === 0 ? (
        <p className="text-zinc-500 text-center">No dishes found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <article key={dish._id}>
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <img
                    src={dish.image || "https://via.placeholder.com/300x160?text=No+Image"}
                    alt={dish.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <CardTitle className="text-lg font-semibold text-zinc-800">{dish.name}</CardTitle>
                  <p className="text-sm text-zinc-600 line-clamp-2">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-800">₹{dish.price}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        dish.dietory === "veg"
                          ? "bg-green-100 text-green-700"
                          : dish.dietory === "non-veg"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {dish.dietory}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{dish.category}</span>
                    <span>{dish.portion}</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDish(dish);
                        setModalOpen("update");
                      }}
                      className="group-hover:bg-zinc-100"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(dish._id)}
                      className="group-hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      )}

      <CreateDishModal
        isOpen={modalOpen === "create"}
        onClose={() => setModalOpen(null)}
        onSuccess={fetchDishes}
        token={token}
      />
      <UpdateDishModal
        isOpen={modalOpen === "update"}
        onClose={() => setModalOpen(null)}
        dish={editingDish}
        onSuccess={fetchDishes}
        token={token}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dish? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}