import "server-only";

import nodemailer from "nodemailer";

export interface EnviarEmailParams {
  para: string;
  assunto: string;
  html: string;
}

//Cria uma instância reutilizavel do nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function emailAdapter({ para, assunto, html }: EnviarEmailParams): Promise<{ sucesso: boolean; erro?: string }> {
  //Valida variáveis de ambiente
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error("[emailAdapter]: SMTP_EMAIL ou SMTP_PASSWORD não configuradas no .env.local");
    return { sucesso: false, erro: "Credenciais SMTP ausentes" };
  }

  try {
    //Faz o sendMail da instância criada anteriormente
    await transporter.sendMail({
      from: `"Cotação Global Cargo" <${process.env.SMTP_EMAIL}>`,
      to: para,
      subject: assunto,
      html: html
    });

    return { sucesso: true };
  } catch (error) {
    console.error("[emailAdapter]: Erro no envio SMTP:", error);
    return { sucesso: false, erro: "Falha ao enviar e-mail" };
  }
}
