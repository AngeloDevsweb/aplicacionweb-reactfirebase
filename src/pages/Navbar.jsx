import { Link } from "react-router-dom";
import {useAuth} from '../context/AuthContext'

export default function Navbar() {
  const {logout} = useAuth()
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary ">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/puntoVenta">
            SoftDev
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/puntoVenta"
                >
                  Punto de Venta
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ventas">
                  Lista de Ventas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/crearProducto">
                  Crear Producto
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={()=>logout()}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
