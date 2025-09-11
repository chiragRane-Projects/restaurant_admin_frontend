import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/store/useAuth";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "full",
    category: "starters",
    dietory: "veg",
    price: "",
    image: "",
  });
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

  const openModal = (dish = null) => {
    setEditingDish(dish);
    setFormData(
      dish || {
        name: "",
        description: "",
        quantity: "full",
        category: "starters",
        dietory: "veg",
        price: "",
        image: "",
      }
    );
    setModalOpen(true);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const url = editingDish ? `${API_BASE}/api/dish/${editingDish._id}` : `${API_BASE}/api/dish/`;
      const method = editingDish ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save dish");
      toast.success(editingDish ? "Dish updated" : "Dish created");
      fetchDishes();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Server error while saving dish");
    }
  };

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
        <Button onClick={() => openModal()} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900">
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
                    <span>{dish.quantity}</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(dish)}
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-800">
              {editingDish ? "Edit Dish" : "Add Dish"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Dish Name</label>
              <Input
                placeholder="Enter dish name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Description</label>
              <Textarea
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Image URL</label>
              <Input
                placeholder="Enter image URL"
                name="image"
                value={formData.image}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Price</label>
              <Input
                type="number"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Dietary</label>
              <Select
                name="dietory"
                value={formData.dietory}
                onValueChange={(value) => handleChange("dietory", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select dietary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Veg</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                  <SelectItem value="eggetarian">Eggetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Category</label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="snacks">Snacks</SelectItem>
                  <SelectItem value="starters">Starters</SelectItem>
                  <SelectItem value="main-course">Main Course</SelectItem>
                  <SelectItem value="desert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Quantity</label>
              <Select
                name="quantity"
                value={formData.quantity}
                onValueChange={(value) => handleChange("quantity", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half">Half</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="bg-zinc-800 hover:bg-zinc-900"
              disabled={loading}
            >
              {editingDish ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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