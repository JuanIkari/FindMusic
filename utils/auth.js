import axios from "axios";
import { TOKEN } from "@env";

const apiKey = TOKEN;

export async function register(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const token = response.data.idToken;
    return token; // Devuelve el token si el registro fue exitoso
  } catch (error) {
    console.log("Error in registration:", error.response?.data || error);
  }
}

/* async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });
    if (response.status === 200) {
      const token = response.data.idToken;
      return token;
    } else {
      console.log("Error in authentication 2");
    }
  } catch (error) {
    console.log("error", error);
  }
}

export async function loginAuth(email, password) {
  return authenticate("login", email, password);
}
 */
