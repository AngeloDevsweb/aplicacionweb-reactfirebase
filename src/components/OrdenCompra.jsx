import { useContext } from "react";
import { Store } from "../context/StoreContext";
import {jsPDF} from 'jspdf'
import "jspdf-autotable"

import appFirebase from "../credenciales";
import { getFirestore, addDoc, collection } from "firebase/firestore";
const db = getFirestore(appFirebase);

export default function OrdenCompra() {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  //variables
  const subtotal = cartItems.reduce((a, c) => a + c.quantity * c.precio, 0);
  const productTotal = cartItems;
  const fecha = new Date();

  const delToCart = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  //esta funcion sera para guardar la info en la base de datos
  const saveSale = async () => {
    try {
      await addDoc(collection(db, "ventas"), {
        ...productTotal,
        fecha,
        subtotal,
      });
      generatePdf()
    } catch (error) {
      alert(error);
    }
    dispatch({ type: "REMOVE_CART" });
    alert("guardado con exito");
  };

  const generatePdf = ()=>{
    const doc = new jsPDF
    const formatDate = formatearFecha(fecha)
    doc.text('FACTURA', 95,20)

    //crear una tabla para los datos de la factura
    const columns = ['Fecha', 'Nombre', 'Precio','Cantidad', 'total']
    const data = productTotal.map(products => [`${formatDate}`, products.nombre, products.precio, products.quantity, subtotal])

    doc.autoTable({
        startY:30,
        head:[columns],
        body: data
    })
    //si quiero mostrar debajo un subtotal
    doc.text(`Total: ${subtotal}$`, 30, 100)
      // Obtener los datos del PDF como Blob
      const pdfData = doc.output('blob');
      // Crear una URL para el Blob
      const pdfUrl = URL.createObjectURL(pdfData);
      //guardar el pdf con un nombre especifico
      doc.save(`factura_${formatDate}.pdf`) 
           // Abrir el PDF en una nueva ventana
      window.open(pdfUrl, '_blank');
  }
//   funcion para formatear fecha
  const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return fecha.toLocaleDateString('es-ES', options);
  };

  return (
    <div>
      <div className="card card-body mt-5">
        <h3 className="text-center">Orden de compra</h3>
        {cartItems.map((item, index) => {
          const uniqueKey = `item-${index}`; // Genera una clave única
          return (
            <div key={uniqueKey}>
              <p>
                <button
                  className="btn btn-danger"
                  onClick={() => delToCart(item)}
                >
                  X
                </button>
                <strong>{item.nombre}</strong>
              </p>
              <p style={{ marginLeft: "10px" }}>cantidad: {item.quantity}</p>
            </div>
          );
        })}

        <div>
          Subtotal: (
          {cartItems.reduce((a, c) => a + parseInt(c.quantity, 10), 0)}) : $
          {cartItems.reduce(
            (a, c) => a + parseInt(c.quantity, 10) * parseFloat(c.precio),
            0
          )}
        </div>

        {cartItems.length ? (
          <button className="btn btn-success" onClick={saveSale}>
            Guardar venta
          </button>
        ) : (
          <button className="btn btn-secondary form-control disabled">
            Selecciona productos
          </button>
        )}
      </div>
    </div>
  );
}
