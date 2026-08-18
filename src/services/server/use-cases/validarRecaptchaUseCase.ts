import { validarRecaptchaAdapter } from "../adapters/validarRecaptchaAdapter";

type ValidarRecaptchaResult = { valido: false; motivo: string } | { valido: true };

// Score minimo para ser aceito no captcha
const SCORE_MINIMO = 0.5;

export async function validarRecaptchaUseCase(token: string): Promise<ValidarRecaptchaResult> {
  //Caso não tenha token
  if (!token) {
    return { valido: false, motivo: "Token de recaptcha ausente" };
  }

  try {
    const dadosGoogle = await validarRecaptchaAdapter(token);

    //Caso não tenha dito sucesso
    if (!dadosGoogle.success) {
      return { valido: false, motivo: "Token de recaptcha inválido ou expirado" };
    }

    //Caso o score seja menor que o minimo
    if (dadosGoogle.score !== undefined && dadosGoogle.score < SCORE_MINIMO) {
      return { valido: false, motivo: "Comportamento suspeito" };
    }

    return { valido: true };
  } catch (error) {
    console.error("[Erro validarRecaptchaUseCase", error);
    return { valido: false, motivo: "Falha interna" };
  }
}
