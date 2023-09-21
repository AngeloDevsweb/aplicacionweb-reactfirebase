import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import PuntoVenta from "./pages/PuntoVenta";
import CrearProducto from "./pages/CrearProducto";
import Ventas from "./pages/Ventas";

import { AuthProvider } from "./context/AuthContext";
import {StoreProvider} from './context/StoreContext'
//import Navbar from "./components/Navbar";


function App() {
  return (
    <AuthProvider>
      <StoreProvider>
      <BrowserRouter>
        <main className="container">
          
          <Routes>
            {/* ruta publica */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* ruta protegida */}
            <Route element={<ProtectedRoute />}>
              
              <Route path="/puntoVenta" element={<PuntoVenta />} />
              <Route path="/crearProducto" element={<CrearProducto />} />
              <Route path="/ventas" element={<Ventas />} />
            </Route>
          </Routes>
        </main>
        
      </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
