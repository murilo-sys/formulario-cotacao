import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { CotacaoCompletaSchema, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import consultarDocBackend from "@/services/server/use-cases/consultarDocUseCase";
import criarCotacaoAdapter from "@/services/server/adapters/criarCotacaoAdapter";
import { enviarEmailCotacaoUseCase } from "@/services/server/use-cases/enviarEmailCotacaoUseCase";
import { OPCOES_NATUREZA } from "@/constants/naturezas";
import { apiSimularValor } from "@/services/server/adapters/simularValorAdapter";
import { calcularPesoCubado } from "@/services/server/utils/calcularPesoCubado";
import { calcularFator } from "@/services/server/utils/calcularFator";
import parseNumberBR from "@/utils/parseNumberBR";

interface CotacaoErroResponseType {
  campo?: string;
  erro: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CriarCotacaoResponse | CotacaoErroResponseType[]>> {
  //Pega o body da request
  const body = await request.json();

  //Faz um safeParse/Check dos dados no schema usando zod
  const dados = CotacaoCompletaSchema.safeParse(body);

  if (!dados.success) {
    //Caso o check não tenha sucesso
    //Mapeia os erros
    const errosFormatados = dados.error.issues.map((valor) => {
      return {
        campo: valor.path.join(".") || "geral",
        erro: valor.message
      };
    });

    return NextResponse.json(errosFormatados, { status: 400 });
  }

  //Usando promise.all para consultar todos juntos ao mesmo tempo
  const [consultaDestinatario, consultaRemetente, consultaSolicitante] = await Promise.all([consultarDocBackend(dados.data.destinatarioDoc), consultarDocBackend(dados.data.remetenteDoc), consultarDocBackend(dados.data.solicitanteDoc)]);

  //Validar o documento destinatarioDoc
  if (!consultaDestinatario.valido) {
    return NextResponse.json([{ campo: "destinatarioDoc", erro: "Documento não cadastrado no sistema" }], { status: 400 });
  }

  //Validar o documento remetenteDoc
  if (!consultaRemetente.valido) {
    return NextResponse.json([{ campo: "remetenteDoc", erro: "Documento não cadastro no sistema" }], { status: 400 });
  }

  //Validar o documento solicitanteDoc
  if (!consultaSolicitante.valido) {
    return NextResponse.json([{ campo: "solicitanteDoc", erro: "Documento não cadastrado no sistema" }], { status: 400 });
  }

  //Caso o cepDestino ou cepOrigem for fator 300, então é fator 300 geral
  const fator = (await calcularFator(consultaDestinatario.cep)) == 300 || (await calcularFator(consultaRemetente.cep)) == 300 ? 300 : 167;

  const pesoCubado = calcularPesoCubado(dados.data.cubagens, fator);

  const dadosValidos = {
    ...dados.data,
    cepOrigem: consultaRemetente.cep,
    cidadeOrigem: consultaRemetente.cidade,
    estadoOrigem: consultaRemetente.estado,
    cepDestino: consultaDestinatario.cep,
    cidadeDestino: consultaDestinatario.cidade,
    estadoDestino: consultaDestinatario.estado,
    pesoTaxado: parseNumberBR(dados.data.pesoReal) > pesoCubado ? parseNumberBR(dados.data.pesoReal) : pesoCubado,
    difalOpcao: dados.data.pagadorFrete === "dest" && !consultaDestinatario.contribuinte ? true : false
  };

  try {
    const cotacao = await criarCotacaoAdapter(dadosValidos);

    if (!cotacao.sequenceCode) {
      return NextResponse.json([{ erro: "Não foi possivel criar sua cotação, verifique as informações inseridas e tente novamente..." }], { status: 400 });
    }

    //Caso houver email do solicitante, dispara o email
    if (dadosValidos.solicitanteEmail?.trim() !== "") {
      const natureza = OPCOES_NATUREZA.find((opcao) => opcao.value === dadosValidos.naturezaMercadoria);

      try {
        const token = process.env.TOKEN_API || "";

        const simulacao = await apiSimularValor("rodo", dadosValidos, token, dadosValidos.pagadorFrete === "dest" && !consultaDestinatario.contribuinte ? true : false);

        //Chama a função para enviar e-mail
        await enviarEmailCotacaoUseCase({
          destinatarioEmail: dadosValidos.solicitanteEmail || "",
          sequenceCode: cotacao.sequenceCode,
          solicitanteNome: dadosValidos.solicitanteNome,
          remetenteDoc: dadosValidos.remetenteDoc,
          destinatarioDoc: dadosValidos.destinatarioDoc,
          cidadeOrigem: dadosValidos.cidadeOrigem,
          estadoOrigem: dadosValidos.estadoOrigem,
          cidadeDestino: dadosValidos.cidadeDestino,
          estadoDestino: dadosValidos.estadoDestino,
          pagador: dadosValidos.pagadorFrete === "dest" ? "Destinatário" : "Remetente",
          pesoReal: dadosValidos.pesoReal,
          totalVolumes: dadosValidos.totalVolumes,
          valorNfe: dadosValidos.valorNfe,
          naturezaMercadoria: natureza ? natureza.label : dadosValidos.naturezaMercadoria,
          valorTotal: simulacao.total,
          subTotal: simulacao.subtotal,
          impostos: simulacao.impostos,
          difal: simulacao.difal
        });
      } catch (error) {
        console.error("[criar-cotacao]: Não foi possível enviar e-mail:", error);
      }
    }

    return NextResponse.json({ valido: true, sequenceCode: cotacao.sequenceCode });
  } catch (error) {
    console.log(error);
    return NextResponse.json([{ erro: "Não foi possivel criar sua cotação, tente novamente mais tarde..." }], { status: 500 });
  }
}
