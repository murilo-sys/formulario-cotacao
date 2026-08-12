import consultarDocBackend from "@/services/server/use-cases/consultarDocUseCase";
import axios from "axios";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<{ message?: unknown; notFound: true | false }>> {
  //Lê os params
  const params = request.nextUrl.searchParams;

  //Lê o doc enviado
  const doc = params.get("documento");

  //Caso não tenha o parametro doc enviado
  if (!doc) return NextResponse.json({ message: "Parâmetro documento não encontrado", notFound: true }, { status: 400 });

  //Adicionado verificação de documento no endpoint
  if (!cnpj.isValid(doc) && !cpf.isValid(doc)) return NextResponse.json({ message: "Documento inválido", notFound: true }, { status: 400 });

  try {
    //Faz a requisição
    const response = await consultarDocBackend(doc);

    //Caso esteja vazio o resultado
    if (!response.valido) {
      return NextResponse.json({ notFound: true }, { status: 404 });
    }

    return NextResponse.json({ notFound: false }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
    }
    return NextResponse.json({ message: "Erro durante a execução, tente novamente mais tarde.", notFound: true }, { status: 500 });
  }
}
