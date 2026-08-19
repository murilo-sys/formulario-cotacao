import "server-only";

import { DadosTemplateCotacao, gerarHtmlCotacao } from "@/templates/emailCotacaoTemplate";
import { emailAdapter } from "../adapters/emailAdapter";

interface EnviarEmailCotacaoInput extends DadosTemplateCotacao {
  destinatarioEmail: string;
}

export async function enviarEmailCotacaoUseCase(input: EnviarEmailCotacaoInput): Promise<void> {
  //Caso não tenha sido enviado e-mail ou não contém @
  if (!input.destinatarioEmail || !input.destinatarioEmail.includes("@")) {
    return;
  }

  const html = gerarHtmlCotacao(input);

  try {
    await emailAdapter({
      para: input.destinatarioEmail,
      assunto: `Cotação #${input.sequenceCode} - Global Cargo`,
      html: html
    });
  } catch (err) {
    console.error("[enviarEmailCotacaoUseCase]: Falha ao enviar e-mail:", err);
  }
}
