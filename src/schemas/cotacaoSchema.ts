import validarCep from "@/utils/validarCep"
import { z } from "zod"

export const CotacaoSchema = z.object({
    cepOrigem: z.string().length(8, "O CEP de origem está incompleto").refine((valor) => { return validarCep(valor) }, { message: "Cep inválido" }),
    cepDestino: z.string().length(8, "O CEP de destino está incompleto").refine((valor) => { return validarCep(valor) }, { message: "Cep inválido" }),
    pesoReal: z.string().min(1, "Informe o peso da carga"),
    valorNfe: z.string().min(1, "Informe o valor da NF-e"),
    totalVolumes: z.string().min(1, "Informe o total de volumes")
})

export type CotacaoDados = z.infer<typeof CotacaoSchema>