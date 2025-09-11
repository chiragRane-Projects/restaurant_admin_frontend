import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

export default function CreateDishModal({ isOpen, onClose, onSuccess, token }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "full",
    category: "starters",
    dietary: "veg",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/dish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create dish");
      toast.success("Dish created");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-800">Add Dish</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <section>
            <label className="text-sm font-medium text-zinc-700">Dish Name</label>
            <Input
              placeholder="Enter dish name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-1"
            />
          </section>
          <section>
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <Textarea
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-1"
            />
          </section>
          <section>
            <label className="text-sm font-medium text-zinc-700">Image URL</label>
            <Input
              placeholder="Enter image URL"
              name="image"
              value={formData.image}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-1"
            />
          </section>
          <section>
            <label className="text-sm font-medium text-zinc-700">Price</label>
            <Input
              type="number"
              placeholder="Enter price"
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="mt-1"
            />
          </section>
          <section>
            <label className="text-sm font-medium text-zinc-700">Dietary</label>
            <Select
              name="dietary"
              value={formData.dietary}
              onValueChange={(value) => handleChange("dietary", value)}
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
          </section>
          <section>
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
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
          </section>
          <section>
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
          </section>
        </form>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-zinc-800 hover:bg-zinc-900"
            disabled={loading}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
