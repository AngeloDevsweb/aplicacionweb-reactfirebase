import { useEffect, useState } from "react";
import appFirebase from "../credenciales";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
const db = getFirestore(appFirebase);

export default function ListaProducts() {
  const [lista, setLista] = useState([]);

  const eliminarProducto = async (id) => {
    // Mostrar la ventana modal
    const modal = document.getElementById("confirmarModal");
    modal.style.display = "block";

    // Agregar un event listener al botón de confirmar
    const confirmButton = document.getElementById("confirmarBoton");
    confirmButton.addEventListener("click", async () => {
      // Eliminar el producto
      await deleteDoc(doc(db, "comidas", id));

      // Ocultar la ventana modal después de la eliminación
      modal.style.display = "none";
    });

    // Agregar un event listener al botón de cancelar
    const cancelButton = document.getElementById("cancelarBoton");
    cancelButton.addEventListener("click", () => {
      // Ocultar la ventana modal sin hacer nada
      modal.style.display = "none";
    });
  };
  //Renderizar la lista de productos de la base de datos de firebase
  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "comidas"));
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    };
    getLista();
  }, [lista]);
  return (
    <div>
      {/* modal */}
      <div id="confirmarModal" className="modalEliminar">
        <div className="contenido-modal">
          <p>¿Estás seguro de que deseas eliminar el producto?</p>
          <button id="confirmarBoton">Confirmar</button>
          <button id="cancelarBoton">Cancelar</button>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Imagen</th>
            <th scope="col">Accion</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((list) => (
            <tr key={list.id}>
              <td>{list.nombre}</td>
              <td>{list.precio}Bs.</td>
              <td>
                <img height={50} width={50} src={list.imagen} />
              </td>
              <td>
                <button
                  onClick={() => eliminarProducto(list.id)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
