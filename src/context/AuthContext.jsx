import { createContext, useState, useContext, useEffect } from "react";

//importar firebase
import appFirebase from "../credenciales";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
const auth = getAuth(appFirebase);

//importar session
import {startSession, endSession, getSession} from '../storage/session'

//contexto de la app
export const AuthContext = createContext();

//custom hook de usecontext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an Authprovider");
  }

  return context;
};

// creamos el provider
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  //variable de estado global
  const [user, setUser] = useState(null);

  //para saber y validar si esta autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signin = async (datos) => {
    try {
      // Configura la persistencia antes de iniciar sesión
    //   await setPersistence(auth, browserSessionPersistence);

     // Iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, datos.email, datos.password);
      startSession(userCredential.user)
        
    //   // Obtener el usuario después de la autenticación
    // const usuarioFirebase = userCredential.user;
    
    // // Actualizar el estado del usuario
    // setUser(usuarioFirebase);

    // await signInWithEmailAndPassword(auth, datos.email, datos.password);

    //   onAuthStateChanged(auth, (usuarioFirebase) => {
    //     if (usuarioFirebase) {
    //       setUser(usuarioFirebase);
    //     } else {
    //       setUser(null);
    //     }
    //   });

      setIsAuthenticated(true);

    } catch (error) {
      alert("El correo o la contraseña son incorrectos");
      console.error(error.message);
    }
  };


  //funcion para cerrar sesion
  const logout = async () => {
    await signOut(auth);
    endSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  //debemos validar el token acces de firebase para mantener la sesion y navegar en las rutas
  useEffect(()=>{
    function checkLogin(){
        const {accessToken, email} = getSession()
        if (!accessToken) {
            setIsAuthenticated(false)
            return setUser(null)
        }

        setIsAuthenticated(true)
        setUser(email)
        // console.log(email);
        // console.log(user);
    }
    checkLogin()
  },[])

  return (
    <AuthContext.Provider value={{ user, signin, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
