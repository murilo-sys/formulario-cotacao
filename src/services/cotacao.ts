import { CotacaoCardType } from "@/components/CotacaoCard";
import { CotacaoDados } from "@/schemas/cotacaoSchema";

export async function simularCotacao(dados: CotacaoDados): Promise<CotacaoCardType | null> {

    console.log(dados)

    const params = new URLSearchParams(dados).toString()

    const resposta = await fetch(`/api/cotacao?${params}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    // Caso tenha sido diferente de 200-299
    if (!resposta.ok) {

        //Caso tenha sido 404 status
        if (resposta.status === 404) {
            throw new Error("Não foi possivel simular a cotação");
        }

        //Caso tenha sido diferente de 404
        throw new Error("Erro durante a simulação. Tente novamente mais tarde.");
    }

    const respostaDados = await resposta.json()

    const resultado: {
        rodo: { total: string, imposto: string, subtotal: string },
        air?: { total: string, imposto: string, subtotal: string }
    } = {
        rodo: {
            total: respostaDados.rodo.data[0].summary.total,
            imposto: respostaDados.rodo.data[0].details.tax_total,
            subtotal: respostaDados.rodo.data[0].details.subtotal
        }
    }

    if (respostaDados.air) {
        resultado.air = {
            total: respostaDados.air.data[0].summary.total,
            imposto: respostaDados.air.data[0].details.tax_total,
            subtotal: respostaDados.air.data[0].details.subtotal
        }
    }

    return resultado
}