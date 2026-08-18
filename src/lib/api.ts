import { getRecaptchaToken } from "@/services/getRecaptchaKey";
import axios from "axios";

//Cria instancia do axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Intercepta as requisições para colocar o reCAPTCHA
api.interceptors.request.use(
  async (config) => {
    //Busca o token
    const recaptchaToken = await getRecaptchaToken();

    //Caso tenha criado com sucesso o token
    if (recaptchaToken) {
      config.headers.set("x-recaptcha-token", recaptchaToken);
    }

    //Permite seguir a requisição com o header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
