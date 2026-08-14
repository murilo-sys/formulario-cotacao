import { CotacaoCompletaDados, CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema";

export async function simularCotacao(dados: CotacaoDados | CotacaoCompletaDados): Promise<CotacaoResponse> {
  let params = {} as CotacaoDados | CotacaoCompletaDados;

  if ("remetenteDoc" in dados) {
    //Transforme os dados recebidos em parametros para o fetch
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
    //Transforme os dados recebidos em parametros para o fetch
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

  // Fetch das cotações
  const resposta = await fetch(`/api/simular-cotacao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });

  // Caso tenha sido diferente de 200-299
  if (!resposta.ok) {
    //Caso tenha sido 404 status
    if (resposta.status === 404) {
      return {
        notFound: true
      };
    }

    //Caso tenha sido barrado pelo Rate Limit
    if (resposta.status === 429) {
      throw new Error("Muitas simulações seguidas! Aguarde alguns segundos...");
    }

    //Caso tenha sido diferente de 404
    throw new Error("Erro durante a simulação. Tente novamente mais tarde.");
  }

  // Transforma em
  const respostaDados = await resposta.json();

  const resultado: {
    rodo: { total: string; difal?: string; prazo: string };
    air?: { total: string; difal?: string; prazo: string };
  } = {
    rodo: {
      total: respostaDados.rodo.dados.total,
      prazo: respostaDados.rodo.dados.prazo,
      difal: respostaDados.rodo.dados.difal
    }
  };

  if (respostaDados.air) {
    resultado.air = {
      total: respostaDados.air.dados.total,
      prazo: respostaDados.air.dados.prazo,
      difal: respostaDados.air.dados.difal
    };
  }

  return { notFound: false, dados: resultado };
}
