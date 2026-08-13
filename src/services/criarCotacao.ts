import { CotacaoCompletaDados, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import axios from "axios";

interface CriarCotacaoResponseError {
  valido: false;
  erro?: string;
}

export default async function criarCotacao(formularioDados: CotacaoCompletaDados): Promise<CriarCotacaoResponse | CriarCotacaoResponseError> {
  try {
    const responseCotacao = await axios.post("/api/criar-cotacao", {
      ...formularioDados
    });

    return {
      valido: true,
      sequenceCode: responseCotacao.data.sequenceCode,
      dataValidade: "10"
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.log(`${error.response?.data?.[0]?.campo} ${error.response?.data?.[0]?.erro}`);
        return {
          valido: false,
          erro: `${error.response?.data?.[0]?.campo} ${error.response?.data?.[0]?.erro}`
        };
      }
    }

    return {
      valido: false
    };
  }
}
