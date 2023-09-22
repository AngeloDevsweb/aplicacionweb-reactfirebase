import {useContext} from 'react'
import {Store} from '../context/StoreContext'

import appFirebase from '../credenciales'
import {getFirestore, addDoc, collection} from 'firebase/firestore'
const db = getFirestore(appFirebase)

export default function OrdenCompra() {
    
    const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const subtotal = cartItems.reduce((a,c)=>a+c.quantity*c.precio, 0)
    const productTotal = cartItems

  const delToCart = (item)=>{
    dispatch({type:"CART_REMOVE_ITEM", payload: item})
  }

  //esta funcion sera para guardar la info en la base de datos
  const saveSale = async()=>{
    try {
        await addDoc(collection(db, "ventas"),{
            ...productTotal, subtotal
        })
          
    } catch (error) {
        alert(error)
    }
    dispatch({type:"REMOVE_CART"})
    alert("guardado con exito")
  }

  return (
    <div>
      <div className="card card-body mt-5">
            <h3 className="text-center">Orden de compra</h3>
            {cartItems.map((item, index) => {
              const uniqueKey = `item-${index}`; // Genera una clave única
              return (
                <div key={uniqueKey}>
                  <p>
                    <button className="btn btn-danger" onClick={()=>delToCart(item)}>X</button>
                    <strong>{item.nombre}</strong>
                  </p>
                  <p style={{ marginLeft: "10px" }}>
                    cantidad: {item.quantity}
                  </p>
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

            {
                cartItems.length ? (
                    <button className='btn btn-success' onClick={saveSale}>Guardar venta</button>
                ) : (
                    <button className='btn btn-secondary form-control disabled'>Selecciona productos</button>
                )
            }
          </div>
    </div>
  )
}
