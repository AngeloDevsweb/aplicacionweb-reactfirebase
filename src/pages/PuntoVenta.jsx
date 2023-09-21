import {useAuth} from '../context/AuthContext'
import {Link} from 'react-router-dom'
import {getSession} from '../storage/session'
import Navbar from './Navbar'

export default function PuntoVenta() {

  const {user, logout} = useAuth()
  const {email} = getSession()

  return (
    <div>
      <Navbar/>
      
    </div>
  )
}
