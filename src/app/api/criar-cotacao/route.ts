import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { CotacaoCompletaSchema, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";

export async function POST(request: NextRequest): Promise<NextResponse<CriarCotacaoResponse>> {
  //Pega o body da request
  const body = await request.json();

  const dados = await CotacaoCompletaSchema.safeParseAsync(body);

  console.log(dados.success);
}
