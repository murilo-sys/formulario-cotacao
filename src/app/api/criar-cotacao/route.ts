import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { CotacaoCompletaSchema, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import consultarDocBackend from "@/services/server/use-cases/consultarDocBackend";

interface CotacaoErroResponseType {
  campo: string;
  erro: string;
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
    console.log(errosFormatados);

    return NextResponse.json(errosFormatados, { status: 400 });
  }

  //Validar o documento destinatarioDoc
  if (!(await consultarDocBackend(dados.data.destinatarioDoc))) {
    return NextResponse.json([{ campo: "destinatarioDoc", erro: "Documento não cadastrado no sistema" }], { status: 401 });
  }

  //Validar o documento remetenteDoc
  if (!(await consultarDocBackend(dados.data.remetenteDoc))) {
    return NextResponse.json([{ campo: "remetenteDoc", erro: "Documento não cadastro no sistema" }], { status: 401 });
  }

  //Validar o documento solicitanteDoc
  if (!(await consultarDocBackend(dados.data.solicitanteDoc))) {
    return NextResponse.json([{ campo: "solicitanteDoc", erro: "Documento não cadastrado no sistema" }], { status: 401 });
  }

  return NextResponse.json({ codigo: "123", valor: "100", dataValidade: "10/02/2006" });
}
