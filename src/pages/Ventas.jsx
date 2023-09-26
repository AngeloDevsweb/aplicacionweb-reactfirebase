import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import appFirebase from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Cambia este valor según tus preferencias
  const [searchDate, setSearchDate] = useState(""); //variable para guardar fecha para filtro por fecha
  const [originalVentas, setOriginalVentas] = useState([]); // Mantén una copia de las ventas originales
  const [isLoading, setIsLoading] = useState(true); // Inicialmente, se establece en true para mostrar el spinner de carga.

  // Declarar las constantes para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ventas.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // funcion para buscar fecha y filtrar datos por fecha
  const handleSearch = () => {
    //console.log('boton clicado');
    const lowerCaseSearchDate = searchDate.toLowerCase();
    //console.log("Filtrando ventas por fecha:", lowerCaseSearchDate);

    // Filtrar ventas en base a la fecha de búsqueda
    const ventasFiltradas = originalVentas.filter((venta) => {
      const fecha = venta.fecha;

      // Verificar que la fecha no sea undefined antes de llamar a toLocaleDateString
      if (fecha) {
        const formattedDate = fecha.toLocaleDateString().toLowerCase();
        return formattedDate.includes(lowerCaseSearchDate);
      }

      return false;
    });

    setVentas(ventasFiltradas);
    setCurrentPage(1);
  };

  // Restablece las ventas originales cuando se borra la fecha de búsqueda
  const handleClearSearch = () => {
    setSearchDate("");
    setVentas(originalVentas);
    setCurrentPage(1);
  };

  useEffect(() => {
    const obtenerVentas = async () => {
      setIsLoading(true); // Establecer isLoading en true antes de cargar los datos
      try {
        const querySnapshot = await getDocs(collection(db, "ventas"));
        const ventasData = [];
        querySnapshot.forEach((doc) => {
          const ventaData = doc.data();
          const productos = [];

          // Iterar sobre el objeto de productos
          for (const key in ventaData) {
            if (key !== "subtotal" && key !== "fecha") {
              productos.push({
                ...ventaData[key],
                id: key,
              });
            }
          }

          // Convertir la marca de tiempo de Firestore en una fecha JavaScript
          const fecha = ventaData.fecha && ventaData.fecha.toDate();

          ventasData.push({
            productos,
            subtotal: ventaData.subtotal,
            fecha,
            id: doc.id,
          });
        });

        setVentas(ventasData);
        setOriginalVentas(ventasData); // Guarda una copia de las ventas originales
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      } finally {
        setIsLoading(false); // Establecer isLoading en false después de cargar los datos
      }
    };

    obtenerVentas();
  }, []);
  //console.log(ventas);
  return (
    <div>
      <Navbar />
      <h1 className="titulo-ventas">Lista de Ventas</h1>
      <input
        type="text"
        className="input-buscar"
        placeholder="Buscar fecha (ej.'25/9/2023')"
        value={searchDate}
        onChange={(e) => {
          setSearchDate(e.target.value);
        }}
      />
      <button className="boton-buscar" onClick={handleSearch}>
        Buscar
      </button>
      <button className="boton-limpiar" onClick={handleClearSearch}>
        Limpiar búsqueda
      </button>
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th scope="col">Venta #</th>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Total</th>
                <th scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {currentVentas.map((venta, index) => (
                <tr key={venta.id}>
                  <td>{index + 1}</td>
                  <td>
                    <ul>
                      {venta.productos.map((producto) => (
                        <li key={producto.id} style={{ listStyleType: "none" }}>
                          {/* <img src={producto.imagen} alt={producto.nombre} /> */}
                          <p>{producto.nombre}</p>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {venta.productos.map((producto) => (
                        <li
                          key={producto.id}
                          style={{
                            listStyleType: "none",
                            marginBottom: "15px",
                          }}
                        >
                          {producto.precio}$
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {venta.productos.map((producto) => (
                        <li
                          key={producto.id}
                          style={{
                            listStyleType: "none",
                            marginBottom: "15px",
                          }}
                        >
                          {producto.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{venta.subtotal}$</td>
                  <td>{venta.fecha && venta.fecha.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* seccion de html para la paginacion */}
      <ul className="pagination">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              className={`page-link ${number === currentPage ? "active" : ""}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(ventas.length / itemsPerPage)}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </div>
  );
}
