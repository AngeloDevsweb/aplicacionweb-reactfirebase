import appFirebase from '../credenciales'
import {getFirestore, collection, addDoc} from 'firebase/firestore'
import {getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState } from 'react'

const db = getFirestore(appFirebase)
const storage = getStorage(appFirebase)

export default function CreateForm() {
    let urlImDesc;
    const [habilitar, setHabilitar] = useState(true)
    
    //funcion para guardar comida
    const guardarProduct = async(e)=>{
        e.preventDefault();
        const nombre = e.target.nombre.value;
        const precio = e.target.precio.value;

        const newComida = {
            nombre : nombre,
            precio: precio,
            imagen: urlImDesc
        }
        console.log(newComida);
    
        // try {
        //     await addDoc(collection(db,'comidas'),{
        //         ...newComida
        //     })
        // } catch (error) {
        //     console.log(error);
        //     alert(error);
        // }
        //reseteo de variables en el formulario
        e.target.nombre.value = ''
        e.target.precio.value = ''
        e.target.file.value = ''
        setHabilitar(true)
    }

    const fileHandler = async(e)=>{
        //detecta el archivo
        const archivoL = e.target.files[0];
        //cargarlo al storage
        const refArchivo = ref(storage, `productos/${archivoL.name}`);
        await uploadBytes(refArchivo, archivoL)
        //obtener la url de la imagen
        urlImDesc = await getDownloadURL(refArchivo)
        // if (urlImDesc) {
        //     alert("Imagen cargada")
        //     setHabilitar(true)
        // }
 
    }

  return (
    <div className="row">
        
        <div className="col-md-5">
        <div className='card card-body'>
            <h3 className='text-center'>Agregar comida</h3>
            <form onSubmit={guardarProduct}>
                <label>Nombre:</label>
                <div className='form-group'>
                    <input type="text" placeholder='ingresar el nombre de la comida' id='nombre'  className='form-control mt-1' required />
                </div>
                <label className='form-label mt-3'>Precio:</label>
                <div className='form-group'>
                    <input type="number" placeholder='ingresar precio de la comida' id='precio'  className='form-control' required />
                </div>

                <label className='form-label mt-3'>Agregar Imagen:</label>
                <input type="file" name="" id="file" placeholder='Agregar la imagen' className='form-control' onChange={fileHandler}  />

                <button className={habilitar ? 'btn btn-primary mt-3 form-control' : 'btn btn-primary mt-3 form-control disabled'}>{habilitar ? "Guardar Producto" : "Llena los campos"}</button>
            </form>
        </div>
        </div>

        <div className="col-md-7">
            tabla de productos
        </div>
        
    </div>
  )
}
