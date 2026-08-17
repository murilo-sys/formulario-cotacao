import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { CotacaoCompletaSchema, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import consultarDocBackend from "@/services/server/use-cases/consultarDocUseCase";
import criarCotacaoAdapter from "@/services/server/adapters/criarCotacaoAdapter";

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

  const dadosValidos = {
    ...dados.data,
    cidadeOrigem: consultaRemetente.cidade,
    estadoOrigem: consultaRemetente.estado,
    cidadeDestino: consultaDestinatario.cidade,
    estadoDestino: consultaDestinatario.estado
  };

  try {
    const cotacao = await criarCotacaoAdapter(dadosValidos);

    if (!cotacao.sequenceCode) {
      return NextResponse.json([{ erro: "Não foi possivel criar sua cotação, verifique as informações inseridas e tente novamente..." }], { status: 400 });
    }

    return NextResponse.json({ valido: true, sequenceCode: cotacao.sequenceCode });
  } catch (error) {
    console.log(error);
    return NextResponse.json([{ erro: "Não foi possivel criar sua cotação, tente novamente mais tarde..." }], { status: 500 });
  }
}
