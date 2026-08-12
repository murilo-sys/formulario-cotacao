import { CotacaoCompletaDados, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";

export default async function criarCotacao(formularioDados: CotacaoCompletaDados): Promise<CriarCotacaoResponse> {
  console.log(formularioDados);

  return {
    valor: "100",
    codigo: "10",
    dataValidade: "10"
  };
}
