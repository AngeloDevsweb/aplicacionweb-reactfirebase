import CreateForm from "../components/CreateForm";
import ListaProducts from "../components/ListaProducts";
import Navbar from "./Navbar";


export default function CrearProducto() {
  return (
    <div>
      <Navbar/>
        <div className="row">
        <div className="col-md-5">
          <CreateForm/>      
        </div>  
        <div className="col-md-7">
          <ListaProducts/>
        </div>
        </div>
    </div>
  )
}
