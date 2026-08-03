import 'server-only'

import { CotacaoDados } from "@/schemas/cotacaoSchema"
import axios from "axios"

interface CotacaoDadosCompleto extends CotacaoDados {
    pesoTaxado: number,
    pesoCubado: number
}

export async function apiSimularValor(modal: "rodo" | "air", dados: CotacaoDadosCompleto, token: string, difalOpcao: boolean) {

    //URL do endpoint
    const url = "https://globalcargo.eslcloud.com.br/api/quote/calculate_freights"

    //Retorna a requisição do axios (basicamente um fetch)
    return await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "*/*"
        },

        //Data substituiu o body do fetch
        data:
        {
            "data": {
                "attributes": {
                    "origin_postal_code": dados.cepOrigem,
                    "destination_postal_code": dados.cepDestino,
                    "customer_price_table_code": `${modal === "rodo" ? "REXP 2026" : "ACON"}`,

                    // CNPJ USADO PARA CALCULO DE DIFAL
                    "recipient_document": `${difalOpcao ? "65971717000126" : ""}`,
                    
                    "real_weight": dados.pesoTaxado,
                    "invoices_value": dados.valorNfe,
                    "invoices_volumes": dados.totalVolumes,
                    "modal": modal
                }
            }
        }
    })
}