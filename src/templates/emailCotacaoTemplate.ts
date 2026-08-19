import "server-only";

export interface DadosTemplateCotacao {
  sequenceCode: number;
  valorTotal: string;
  subTotal: string;
  impostos: string;
  difal?: string;
  solicitanteNome: string;
  remetenteDoc: string;
  destinatarioDoc: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  pagador: "Destinatário" | "Remetente";
  pesoReal: string;
  totalVolumes: string;
  valorNfe: string;
  naturezaMercadoria: string;
}

export function gerarHtmlCotacao(dados: DadosTemplateCotacao): string {
  return `
    <div style="font-family: sans-serif; color: #333333; line-height: 1.6; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

  <div style="height: 4px; background-color: #d9383a; margin-bottom: 20px; border-radius: 4px 4px 0 0;"></div>

  <h2 style="color: #1a3a6b; margin-top: 0; margin-bottom: 20px; font-size: 22px; border-bottom: 2px solid #1a3a6b; padding-bottom: 10px;">
    Olá, ${dados.solicitanteNome}!
  </h2>
  
  <p style="margin: 0 0 16px 0; font-size: 15px;">
    Recebemos com sucesso a sua cotação nº <strong style="color: #1a3a6b;">${dados.sequenceCode}</strong>.
  </p>
  
  <div style="background-color: #f8fafc; border-left: 4px solid #d9383a; padding: 15px; margin: 20px 0; border-radius: 0 6px 6px 0;">
    <p style="margin: 0; font-size: 15px; color: #1a3a6b;">
      <strong>Prazo de validade:</strong> 10 dias <strong style="color: #d9383a;">corridos.</strong>
    </p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <h3 style="color: #1a3a6b; margin-top: 0; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Dados da cotação</h3>
    <p style="margin: 0; font-size: 14px;"><strong>Remetente:</strong> ${dados.remetenteDoc}</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Destinatário:</strong> ${dados.destinatarioDoc}</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Trecho:</strong> ${dados.cidadeOrigem.trim()} - ${dados.estadoOrigem.trim()} X ${dados.cidadeDestino.trim()} - ${dados.estadoDestino.trim()}</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Pagador:</strong> ${dados.pagador}</p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <h3 style="color: #1a3a6b; margin-top: 0; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Dados da Mercadoria</h3>
    <p style="margin: 0; font-size: 14px;"><strong>Volumes:</strong> ${dados.totalVolumes} un</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Peso Real:</strong> ${dados.pesoReal} kg</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Natureza da Carga:</strong> ${dados.naturezaMercadoria}</p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; margin: 20px 0; border-radius: 6px;">
    <h3 style="color: #1a3a6b; margin-top: 0; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Valores e Impostos</h3>
    <p style="margin: 0; font-size: 14px;"><strong>Valor total:</strong> R$ ${dados.valorTotal || "Não informado"}</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Sub-total:</strong> R$ ${dados.subTotal}</p>
    <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Impostos:</strong> R$ ${dados.impostos}</p>
    ${dados.difal && dados.difal !== "0" ? `<p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Difal:</strong> R$ ${dados.difal}</p>` : ""}
  </div>

  <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 6px 6px 0;">
    <p style="margin: 0 0 10px 0; font-size: 14px; color: #333333;">
      <strong style="color: #d9383a;">Atenção:</strong> Em sua Nota Fiscal deverá constar os dados da Global Cargo <strong>(GLOBAL AIR CARGO LTDA - CNPJ 00.945.958/0001-55)</strong> no campo de transportador. Nos casos em que a NF já está emitida e não consta o CNPJ, enviar o XML da Nota Fiscal para <strong>xml@globalcargo.com.br</strong>.
    </p>
  </div>
  
  <span style="margin: 0 0 30px 0; font-size: 15px;">
                <strong>Aviso:</strong> Os valores e prazos informados nesta simulação são de tabela padrão e não contemplam acordos comerciais ou negociações prévias.
              </span>
  
  <p style="margin:  30px 0; font-size: 15px;">
    Em caso de dúvidas, entre em contato com a equipe de suporte da Global informando o número da sua solicitação.
  </p>
  
  <p style="margin: 0; color: #555555; font-size: 15px;">Atenciosamente,</p>
  <p style="margin: 4px 0 0 0; font-weight: bold; color: #1a3a6b; font-size: 18px; letter-spacing: 0.5px;">
    Global Cargo
  </p>
  <p style="margin: 0; font-size: 12px; color: #d9383a">Paixão por entregar bem ✓</p>
  
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
  <p style="font-size: 12px; color: #777777; margin: 0; text-align: center; font-style: italic;">
    Esta é uma mensagem automática, por favor não responda.
  </p>
</div>
    `;
}
