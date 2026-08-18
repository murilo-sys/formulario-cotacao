import "server-only";
import axios from "axios";

interface RecaptchaGoogleResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function validarRecaptchaAdapter(token: string | null): Promise<RecaptchaGoogleResponse> {
  //Lê a variavel de ambiente
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  //Caso não exista
  if (!secretKey) {
    console.error("ERRO: Token do recaptcha não cadastrado no ambiente");
    throw new Error("RECAPTCHA_SECRET_KEY não configurada no servidor");
  }

  //Faz a requisição post para a google
  const resposta = await axios.post<RecaptchaGoogleResponse>("https://www.google.com/recaptcha/api/siteverify", null, { params: { secret: secretKey, response: token } });

  return resposta.data;
}
