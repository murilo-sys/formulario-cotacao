import { CotacaoCompletaDados, CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema";
import api from "@/lib/api";
import axios from "axios";

interface SimularCotacaoApiResponse {
  rodo: {
    dados: {
      total: string;
      difal?: string;
      prazo: string;
      impostos: string;
      subtotal: string;
    };
  };
  air?: {
    dados: {
      total: string;
      difal?: string;
      prazo: string;
      impostos: string;
      subtotal: string;
    };
  };
}

export async function simularCotacao(dados: CotacaoDados | CotacaoCompletaDados): Promise<CotacaoResponse> {
  let params = {} as CotacaoDados | CotacaoCompletaDados;

  if ("remetenteDoc" in dados) {
    params = {
      solicitanteDoc: dados.solicitanteDoc,
      solicitanteNome: dados.solicitanteNome,
      pesoReal: dados.pesoReal,
      valorNfe: dados.valorNfe,
      totalVolumes: dados.totalVolumes,
      cubagens: dados.cubagens,
      remetenteDoc: dados.remetenteDoc,
      destinatarioDoc: dados.destinatarioDoc,
      pagadorFrete: dados.pagadorFrete,
      naturezaMercadoria: dados.naturezaMercadoria
    };
  } else {
    params = {
      solicitanteDoc: dados.solicitanteDoc,
      solicitanteNome: dados.solicitanteNome,
      cepOrigem: dados.cepOrigem,
      cepDestino: dados.cepDestino,
      pesoReal: dados.pesoReal,
      valorNfe: dados.valorNfe,
      totalVolumes: dados.totalVolumes,
      cubagens: dados.cubagens,
      difalOpcao: dados.difalOpcao || false
    };
  }

  try {
    const response = await api.post<SimularCotacaoApiResponse>("/simular-cotacao", params);
    const respostaDados = response.data;

    const resultado: {
      rodo: { total: string; difal?: string; impostos: string; prazo: string; subtotal: string };
      air?: { total: string; difal?: string; impostos: string; prazo: string; subtotal: string };
    } = {
      rodo: {
        total: respostaDados.rodo.dados.total,
        prazo: respostaDados.rodo.dados.prazo,
        difal: respostaDados.rodo.dados.difal,
        impostos: respostaDados.rodo.dados.impostos,
        subtotal: respostaDados.rodo.dados.subtotal
      }
    };

    if (respostaDados.air) {
      resultado.air = {
        total: respostaDados.air.dados.total,
        prazo: respostaDados.air.dados.prazo,
        difal: respostaDados.air.dados.difal,
        impostos: respostaDados.air.dados.impostos,
        subtotal: respostaDados.air.dados.subtotal
      };
    }

    return { notFound: false, dados: resultado };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Caso a rota retorne 404 ou 400 (Cotação não disponível)
      if (error.response?.status === 404 || error.response?.status === 400) {
        return { notFound: true };
      }

      // Caso tenha sido barrado pelo Rate Limit (429)
      if (error.response?.status === 429) {
        throw new Error("Muitas simulações seguidas! Aguarde alguns segundos...");
      }

      // Caso tenha sido barrado pelo reCAPTCHA / Proxy (403)
      if (error.response?.status === 403) {
        throw new Error("Acesso não autorizado. Recarregue a página e tente novamente.");
      }
    }

    // Erro genérico
    throw new Error("Erro durante a simulação. Tente novamente mais tarde.");
  }
}
