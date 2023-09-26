//import {getSession} from '../storage/session'
import { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { Store } from "../context/StoreContext";
import appFirebase from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import OrdenCompra from "../components/OrdenCompra";
const db = getFirestore(appFirebase);

export default function PuntoVenta() {
  const [lista, setLista] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente, se establece en true para mostrar el spinner de carga
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  console.log(cartItems);
  // funcion para añadir al carrito
  const addToCart = (id) => {
    const product = lista.find((x) => x.id === id);
    const existItem = state.cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
  };

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
      } finally {
        setIsLoading(false);
      }
    };
    getLista();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="row">
        <div className="col-md-8">
          {/* esta es la seccion para la lista de productos */}
          <div className="row row-cols-1 row-cols-md-3 g-3 mt-4">
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                {lista.map((list) => (
                  <div key={list.id} className="tarjeta">
                    <img
                      src={list.imagen}
                      alt="imagen"
                      className="imagen-pos"
                    />
                    <h5 className="titulo-comida">{list.nombre}</h5>
                    <div className="padre-precio-boton">
                      <h5 className="estilo-precio">{list.precio}$</h5>
                      <button
                        className="estilo-boton"
                        onClick={() => addToCart(list.id)}
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="col-md-4">
          {/* esta seccion es para visualizar la orden de compra */}
          <OrdenCompra />
        </div>
      </div>
    </div>
  );
}
