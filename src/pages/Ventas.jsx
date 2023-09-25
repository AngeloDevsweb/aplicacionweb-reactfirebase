import {useState, useEffect} from 'react'
import Navbar from "./Navbar";
import appFirebase from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function Ventas() {

  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ventas"));
        const ventasData = [];
        querySnapshot.forEach((doc) => {
          const ventaData = doc.data();
          const productos = [];

          // Iterar sobre el objeto de productos
          for (const key in ventaData) {
            if (key !== 'subtotal' && key !== 'fecha') {
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
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    obtenerVentas();
  }, []);

  console.log(ventas);

  return (
    <div>
      <Navbar/>
      <h1>Lista de Ventas</h1>
      <ul className='row row-cols-1 row-cols-md-3 g-3'>
      {ventas.map((venta, index) => (
          <li key={venta.id} className='card card-body'>
            <h2>Venta #{index + 1}</h2>
            <ul>
              {venta.productos.map((producto) => (
                <li key={producto.id}>
                  {/* <img src={producto.imagen} alt={producto.nombre} /> */}
                  <h3>{producto.nombre}</h3>
                  <p>Precio: {producto.precio}</p>
                  <p>Cantidad: {producto.quantity}</p>
                </li>
              ))}
            </ul>
            <p>Subtotal: {venta.subtotal}</p>
            {venta.fecha && (
              <p>Fecha: {venta.fecha.toLocaleString()}</p>
            )}
          </li>
        ))}
      </ul>
     </div>
  )
}
