import axios from "axios";
import { TOKEN } from "@env";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { appFirebase } from "../credenciales";

const apiKey = TOKEN;
const db = getFirestore(appFirebase);

// Función principal de registro/autenticación
export async function register(email, password, spotifyToken) {
  const registerUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const spotifyProfileUrl = "https://api.spotify.com/v1/me";

  try {
    // Intentamos registrar el usuario
    const response = await axios.post(registerUrl, {
      email,
      password,
      returnSecureToken: true,
    });

    const userId = response.data.localId; // UID único del usuario

    // Automáticamente registra al usuario en Firestore
    await registerUser(userId, email);

    console.log("Registro y almacenamiento exitoso");
    return response.data.idToken;
  } catch (error) {
    // Si hay error en el registro, intenta login
    try {
      const loginResponse = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true,
      });

      const userId = loginResponse.data.localId;

      // Automáticamente asegura que el usuario está en Firestore
      await registerUser(userId, email);

      console.log("Login exitoso y datos asegurados en Firestore");
      return loginResponse.data.idToken;
    } catch (loginError) {
      console.error("Error durante login o registro:", loginError);
      throw new Error("No se pudo autenticar o registrar al usuario.");
    }
    
  }
}

// Función para guardar datos en Firestore autaomáticamente
const registerUser = async (id, email) => {
  try {
    const userRef = doc(db, "usuarios", id); // El UID como identificador único
    await setDoc(userRef, {
      id,
      email,
      friends: [], // Lista vacía inicial
      name: email.split("@")[0], // Por defecto toma el nombre del email antes del '@'
    });
    console.log("Usuario almacenado en Firestore");
  } catch (error) {
    console.error("Error al guardar datos del usuario en Firestore:", error);
  }
};