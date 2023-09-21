//import {getSession} from '../storage/session'
import {useState, useEffect, useContext} from 'react'
import Navbar from './Navbar'
import { Store } from '../context/StoreContext';
import appFirebase from '../credenciales'
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
const db = getFirestore(appFirebase);

export default function PuntoVenta() {
  const [lista, setLista] = useState([]);
  const {state, dispatch} = useContext(Store)
  const {cart: {cartItems},} = state

  // funcion para añadir al carrito
  const addToCart = (id) => {
    const product = lista.find(x => x.id === id);
    const existItemIndex = state.cart.cartItems.findIndex(x => x.id === product.id);

    if (existItemIndex !== -1) {
        // Si el artículo ya existe en el carrito, incrementa la cantidad en 1
        const cartItems = [...state.cart.cartItems];
        cartItems[existItemIndex].quantity += 1;

        dispatch({ type: 'ADD_TO_CART', payload: { ...state.cart, cartItems } });
    } else {
        // Si el artículo no existe en el carrito, agrégalo con cantidad 1
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
    }
}

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
  }, []);

  return (
    <div>
      <Navbar />

      <div className="row">
        <div className="col-md-8">
          {/* esta es la seccion para la lista de productos */}
          <h1 className="text-center mt-4 mb-5">Lista de comidas</h1>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {lista.map((list) => (
              <div key={list.id}>
                <img src={list.imagen} alt="imagen" height={250} width="100%" />
                <h3>{list.nombre}</h3>
                <h5>{list.precio}$</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(list.id)}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          {/* esta seccion es para visualizar la orden de compra */}
          <div className="card card-body mt-5">
            <h3 className="text-center">Orden de compra</h3>
            {cartItems.map((item, index) => {
              const uniqueKey = `item-${index}`; // Genera una clave única
              return (
                <div key={uniqueKey}>
                  <h3>{item.nombre}</h3>
                  <h5>{item.quantity}</h5>
                </div>
              );
            })}

            
                      <div>
              Subtotal: ({cartItems.reduce((a, c) => a + parseInt(c.quantity, 10), 0)}) : $
              {cartItems.reduce((a, c) => a + parseInt(c.quantity, 10) * parseFloat(c.precio), 0)}
          </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
