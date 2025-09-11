import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import './index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import { useAuth } from "./store/useAuth";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");
if(token){
  useAuth.setState({ token, user });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes/>
    <ToastContainer position="bottom-right"/>
  </React.StrictMode>
)