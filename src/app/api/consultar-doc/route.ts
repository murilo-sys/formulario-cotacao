import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //Lê os params
  const params = request.nextUrl.searchParams;

  //Lê o doc enviado
  const doc = params.get("documento");

  //Caso não tenha o parametro doc enviado
  if (!doc) return NextResponse.json({ message: "Parâmetro documento não encontrado" }, { status: 400 });

  //Lê a variavel de ambiente
  const token = process.env.TOKEN_GRAPHQL_API;

  //Caso não tenha o token
  if (!token) {
    console.error("Token API graphql não cadastrada.");
    return NextResponse.json({ message: "Erro durante a execução, tente novamente mais tarde." }, { status: 500 });
  }

  try {
    //Faz a requisição
    const response = await axios.post(
      "https://globalcargo.eslcloud.com.br/graphql",

      // 2º Argumento: Corpo do POST (payload JSON)
      {
        params: {
          cnpj: doc
        }
      },

      // 3º Argumento: Configurações e Cabeçalhos HTTP
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}` // 💡 Ou apenas token, caso a ESL não use a palavra "Bearer "
        }
      }
    );

    console.log("deu certo");
    console.log(response.data);

    return NextResponse.json({ response });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
    }
    return NextResponse.json({ message: "Erro durante a execução, tente novamente mais tarde." }, { status: 500 });
  }
}
