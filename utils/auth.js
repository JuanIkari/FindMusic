import axios from "axios";
import { TOKEN } from "@env";

const apiKey = TOKEN;

export async function register(email, password) {
  const registerUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    // Intentamos registrar el usuario
    const response = await axios.post(registerUrl, {
      email,
      password,
      returnSecureToken: true,
    });

    // Si el registro es exitoso, retornamos el token
    return response.data.idToken;
  } catch (error) {
    // Si hay un error, asumimos que el usuario ya está registrado e intentamos iniciar sesión
    try {
      const loginResponse = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true,
      });

      // Retornamos el token de sesión
      return loginResponse.data.idToken;
    } catch (loginError) {
      console.log("Error en autenticación o registro:", loginError);
      throw new Error("No se pudo autenticar o registrar al usuario.");
    }
  }
}
