import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";

interface CriarCotacaoResponse {
  codigo: string;
  valor: string;
}

export default async function criarCotacao(formularioDados: CotacaoCompletaDados): Promise<CriarCotacaoResponse> {}
