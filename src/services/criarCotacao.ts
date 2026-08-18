import api from "@/lib/api";
import { CotacaoCompletaDados, CriarCotacaoResponse } from "@/schemas/cotacaoSchema";
import axios from "axios";

interface CriarCotacaoResponseError {
  valido: false;
  erro?: string;
}

export default async function criarCotacao(formularioDados: CotacaoCompletaDados): Promise<CriarCotacaoResponse | CriarCotacaoResponseError> {
  try {
    const responseCotacao = await api.post("/criar-cotacao", {
      ...formularioDados
    });

    return {
      valido: true,
      sequenceCode: responseCotacao.data.sequenceCode
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return {
          valido: false,
          erro: `${error.response?.data?.[0]?.campo || ""} ${error.response?.data?.[0]?.erro}`
        };
      }
    }

    return {
      valido: false
    };
  }
}
