import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { CotacaoCompletaSchema, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import consultarDocBackend from "@/services/server/use-cases/consultarDocUseCase";

interface CotacaoErroResponseType {
  campo: string;
  erro: string;
}

interface  extends{

}

export async function POST(request: NextRequest): Promise<NextResponse<CriarCotacaoResponse | CotacaoErroResponseType[]>> {
  //Pega o body da request
  const body = await request.json();

  //Faz um safeParse/Check dos dados no schema usando zod
  const dados = CotacaoCompletaSchema.safeParse(body);

  //Caso o check não tenha sucesso
  if (!dados.success) {
    //Mapeia os erros
    const errosFormatados = dados.error.issues.map((valor) => {
      return {
        campo: valor.path.join(".") || "geral",
        erro: valor.message
      };
    });

    return NextResponse.json(errosFormatados, { status: 400 });
  }
  //Usando promise.all para consultar todos juntos
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

  try {
  } catch (error) {}

  return NextResponse.json({ codigo: "123", valor: "100", dataValidade: "10/02/2006" });
}
