import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Dishes from "@/pages/Dishes";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Tables from "@/pages/Tables";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dishes" element={<Dishes />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/orders" element={<Orders/>}/>
                    <Route path="/tables" element={<Tables />} />
                </Route>
            </Routes>
        </Router>
    );
}