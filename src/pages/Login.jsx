import { useEffect, useState } from "react"
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const valorInicial = {
    email : "",
    password:""
  }
  //custom hook
  const {signin, isAuthenticated} = useAuth()
  //variable de estado
  const [datos, setDatos] = useState(valorInicial)

  const navigate = useNavigate()

  const capturarDatos = (e)=>{
    const {name, value} = e.target;
    setDatos({...datos, [name]:value})
  }

  const login = async(e)=>{
    e.preventDefault()
    //console.log(datos);
    await signin(datos)
  }

  useEffect(()=>{
    if (isAuthenticated) {
      navigate('/puntoVenta')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isAuthenticated])


  return (
    <div className="">
      <div className="container">
        <form className="centrar" onSubmit={login}>
          <div className="card card-body shadow-lg">
            <h2 className="text-center">LOGIN</h2>
            <input type="email" placeholder="ingrese su correo" className="form-control mt-3" name="email" required onChange={capturarDatos} />
            <input type="password" placeholder="contraseña" className="form-control mt-3" name="password" onChange={capturarDatos}  />
            <button className="btn btn-primary mt-3">Iniciar sesion</button>
          </div>
        </form>
      </div>
    </div>
  )
}
