import axios from "axios";
import { TOKEN } from "@env";
import { Alert } from "react-native";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { appFirebase } from "../credenciales";

const apiKey = TOKEN;
const db = getFirestore(appFirebase);

export async function register(email, password) {
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

    // Obtener el token de acceso de Spotify
    const spotifyToken = response.data.idToken;

    // Obtener los detalles del usuario de Spotify
    const spotifyResponse = await axios.get(spotifyProfileUrl, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
 
    const userData = {
      id: response.data.localId,
      nombre: spotifyResponse.data.display_name, 
      email: email,
      friends: [],
    };
    await saveUserData(userData);

    // Retornamos el token
    return response.data.idToken;
  } catch (error) {
    // Si hay un error, asumimos que el usuario ya está registrado e intentamos iniciar sesión
    try {
      const loginResponse = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true,
      });

      // Obtener el token de acceso de Spotify
      const spotifyToken = loginResponse.data.idToken;

      // Obtener los detalles del usuario de Spotify
      const spotifyResponse = await axios.get(spotifyProfileUrl, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });

      const userData = {
        id: loginResponse.data.localId,
        nombre: spotifyResponse.data.display_name,
        email: email,
        friends: [],
      };
      await saveUserData(userData);

      // Retornamos el token de sesión
      return loginResponse.data.idToken;
    } catch (loginError) {
      console.log("Error en autenticación o registro:", loginError);
      throw new Error("No se pudo autenticar o registrar al usuario.");
    }
  }
}

async function saveUserData(userData) {
  try {
    //  referencia al usuario usando el userId como ID
    const userRef = doc(db, "users", userData.id);

    // Guardar los datos del usuario en Firestore por ID
    await setDoc(userRef, userData);

    Alert.alert(
      "Usuario guardado",
      "Los datos del usuario se han guardado correctamente"
    );
  } catch (error) {
    console.error("Error al guardar los datos del usuario:", error);
    Alert.alert(
      "Error",
      "No se guardaron los datos del usuario."
    );
  }
}