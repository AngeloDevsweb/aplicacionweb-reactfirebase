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

          ventasData.push({
            productos,
            subtotal: ventaData.subtotal,
            fecha: ventaData.fecha,
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
      <ul>
        {ventas.map((venta, index) => (
          <li key={index}>
            <h2>Venta #{index + 1}</h2>
            <ul>
              {venta.productos.map((producto, prodIndex) => (
                <li key={prodIndex}>
                  <img src={producto.imagen} alt={producto.nombre} width={100} height={100} />
                  <h3>{producto.nombre}</h3>
                  <p>Precio: {producto.precio}</p>
                  <p>Cantidad: {producto.quantity}</p>
                </li>
              ))}
            </ul>
            <p>Subtotal: {venta.subtotal}</p>
            {/* <p>Fecha: {venta.fecha}</p> */}
          </li>
        ))}
      </ul>
     </div>
  )
}
