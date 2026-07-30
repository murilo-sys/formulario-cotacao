import 'server-only'

import { CotacaoDados } from "@/schemas/cotacaoSchema"
import axios from "axios"

export async function apiSimularValor(modal: "rodo" | "air", dados: CotacaoDados, token: string, fator: 167 | 300) {

    //URL do endpoint
    const url = "https://globalcargo.eslcloud.com.br/api/quote/calculate_freights"

    //AIR é sempre 167 o fator. Caso tenha vindo fator 300 no modal AIR, transforma para 167
    if (modal === "air" && fator === 300) {
        dados.peso = String((Number(dados.peso) / 300) * 167)
    }

    //Retorna a requisição do axios (basicamente um fetch)
    return await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "*/*"
        },

        //Data substituiu o body no axios
        data:
        {
            "data": {
                "attributes": {
                    "origin_postal_code": dados.cepOrigem,
                    "destination_postal_code": dados.cepDestino,
                    "customer_price_table_code": `${modal === "rodo" ? "REXP 2026" : "ACON"}`,

                    // CNPJ USADO PARA CALCULO DE DIFAL
                    //"recipient_document": "65971717000126",
                    "real_weight": dados.peso,
                    "invoices_value": dados.valorNfe,
                    "invoices_volumes": dados.totalVolumes,
                    "modal": modal
                }
            }
        }
    })
}