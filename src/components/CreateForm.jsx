import appFirebase from "../credenciales";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function CreateForm() {
  //let urlImDesc;
  const [habilitar, setHabilitar] = useState(false);
  const [urlImg, setUrlImg] = useState();

  //funcion para guardar comida
  const guardarProduct = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const precio = e.target.precio.value;

    const newComida = {
      nombre: nombre,
      precio: precio,
      imagen: urlImg,
    };
    console.log(newComida);
    try {
      await addDoc(collection(db, "comidas"), {
        ...newComida,
      });
    } catch (error) {
      console.log(error);
      alert(error);
    }
    //reseteo de variables en el formulario
    e.target.nombre.value = "";
    e.target.precio.value = "";
    e.target.file.value = "";
    setHabilitar(false);
  };

  const fileHandler = async (e) => {
    try {
      //detecta el archivo
      const archivoL = e.target.files[0];
      //cargarlo al storage
      const refArchivo = ref(storage, `productos/${archivoL.name}`);
      await uploadBytes(refArchivo, archivoL);
      //obtener la url de la imagen
      const url = await getDownloadURL(refArchivo);
      setUrlImg(url);
      alert("imagen cargada con exito");
      setHabilitar(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="shadow-lg">
      <div className="card card-body">
        <h3 style={{textAlign:"center", color:"tomato", marginBottom:"18px"}}>Agregar comida</h3>
        <form onSubmit={guardarProduct}>
          <label>Nombre:</label>
          <div className="form-group">
            <input
              type="text"
              placeholder="ingresar el nombre de la comida"
              id="nombre"
              className="form-control mt-1"
              required
            />
          </div>
          <label className="form-label mt-3">Precio:</label>
          <div className="form-group">
            <input
              type="number"
              placeholder="ingresar precio de la comida"
              id="precio"
              className="form-control"
              required
            />
          </div>

          <label className="form-label mt-3">Agregar Imagen:</label>
          <input
            type="file"
            name=""
            id="file"
            placeholder="Agregar la imagen"
            className="form-control"
            onChange={fileHandler}
            required
          />

          <button
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className={
              habilitar
                ? "btn btn-primary mt-3 form-control"
                : "btn btn-secondary mt-3 form-control disabled"
            }
          >
            {habilitar ? "Guardar Producto" : "Llena los campos"}
          </button>
        </form>
      </div>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Ventana de alerta
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Producto guardado correctamente</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
