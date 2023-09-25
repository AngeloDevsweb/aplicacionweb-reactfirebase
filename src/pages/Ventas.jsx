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
      <table className='table table-hover table-bordered'>
        <thead>
          <tr>
            <th scope="col">Venta #</th>
            <th scope="col">Producto</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Total</th>
            <th scope="col" >Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => (
            <tr key={venta.id}>
              <td>{index + 1}</td>
              <td>
                <ul>
                  {venta.productos.map((producto) => (
                    <li key={producto.id} style={{listStyleType: "none"}}>
                      {/* <img src={producto.imagen} alt={producto.nombre} /> */}
                      <p>{producto.nombre}</p>
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {venta.productos.map((producto) => (
                    <li key={producto.id}  style={{listStyleType: "none", marginBottom:'15px'}}>
                      {producto.precio}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {venta.productos.map((producto) => (
                    <li key={producto.id} style={{listStyleType: "none", marginBottom:'15px'}}>
                      {producto.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{venta.subtotal}$</td>
              <td>
                {venta.fecha && venta.fecha.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     </div>
  )
}
