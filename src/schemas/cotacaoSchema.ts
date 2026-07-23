import { z } from "zod"

export const CotacaoSchema = z.object({
    cepOrigem: z.string().length(8, "O CEP de origem está incompleto"),
    cepDestino: z.string().length(8, "O CEP de destino está incompleto"),
    pesoReal: z.string().min(1, "Informe o peso da carga").refine((valor) => { return Number(valor) > 0 }),
    valorNfe: z.string().min(1, "Informe o valor da NF-e").refine((valor) => { return Number(valor) > 0 }),
    totalVolumes: z.string().min(1, "Informe o total de volumes").refine((valor) => { return Number(valor) > 0 })
})

export type CotacaoDados = z.infer<typeof CotacaoSchema>

export interface CotacaoCardType {
    rodo: {
        total: string
        subtotal: string
        imposto: string
    }
    air?: {
        total: string
        subtotal: string
        imposto: string
    }
}

export type CotacaoResponse =
    | { notFound: true }
    | { notFound: false; dados: CotacaoCardType };
