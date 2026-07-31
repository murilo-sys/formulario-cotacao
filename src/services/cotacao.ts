import { CotacaoDados, CotacaoResponse } from "@/schemas/cotacaoSchema";


export async function simularCotacao(dados: CotacaoDados): Promise<CotacaoResponse> {

    //Transforme os dados recebidos em parametros para o fetch
    const params = ({
        cepOrigem: dados.cepOrigem,
        cepDestino: dados.cepDestino,
        pesoReal: dados.pesoReal,
        valorNfe: dados.valorNfe,
        totalVolumes: dados.totalVolumes,
        cubagens: dados.cubagens
    })

    // Fetch das cotações
    const resposta = await fetch(`/api/cotacao?${params}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

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
            throw new Error("Muitas simulações seguidas! Aguarde alguns segundos.");
        }

        //Caso tenha sido diferente de 404
        throw new Error("Erro durante a simulação. Tente novamente mais tarde.");
    }

    // Transforma em
    const respostaDados = await resposta.json()

    const resultado: {
        rodo: { total: string, peso: number, difal?: number },
        air?: { total: string, peso: number, difal?: number }
    } = {
        rodo: {
            total: respostaDados.rodo.dados.data[0].summary.total,
            peso: respostaDados.rodo.pesoTaxado
        }
    }

    if (respostaDados.air) {
        resultado.air = {
            total: respostaDados.air.dados.data[0].summary.total,
            peso: respostaDados.air.pesoTaxado
        }
    }

    return { notFound: false, dados: resultado }
}