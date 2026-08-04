import { cnpj, cpf } from "cpf-cnpj-validator"
import { z } from "zod"

export const ItemCubagemSchema = z.object({
    altura: z.string().min(1, "Altura inválida").regex(/^[0-9,]+$/, "Altura com caracteres inválidos"),
    largura: z.string().min(1, "Largura inválida").regex(/^[0-9,]+$/, "largura com caracteres inválidos"),
    comprimento: z.string().min(1, "Comprimento inválido").regex(/^[0-9,]+$/, "Comprimento com caracteres inválidos"),
    quantidade: z.string().min(1, "Quantidade inválida").regex(/^[0-9,]+$/, "Quantidade com caracteres inválidos")
})

export const CotacaoSchema = z.object({
    solicitanteNome: z.string().min(4, "Informe seu nome"),
    solicitanteDoc: z.string().min(11, "CPF ou CNPJ inválido").refine((valor) => { return valor.length === 14 ? cnpj.isValid(valor) : cpf.isValid(valor) }, { message: "Documento inválido" }),
    cepOrigem: z.string().length(8, "O CEP de origem está incompleto"),
    cepDestino: z.string().length(8, "O CEP de destino está incompleto"),
    pesoReal: z.string().min(1, "Informe o peso da carga").refine((valor) => { return Number(valor) > 0 }),
    valorNfe: z.string().min(1, "Informe o valor da NF-e").refine((valor) => { return Number(valor) > 0 }),
    totalVolumes: z.string().min(1, "Informe o total de volumes").refine((valor) => { return Number(valor) > 0 }),
    difalOpcao: z.boolean(),

    //Array dinâmico de cubagens
    cubagens: z.array(ItemCubagemSchema)
})

export type CotacaoDados = z.infer<typeof CotacaoSchema>

export type CubagemType = z.infer<typeof ItemCubagemSchema>

export interface CotacaoDadosCard {
    total: string
    peso: number
    difal?: string
    prazo: string
}

export interface CotacaoCardType {
    rodo: CotacaoDadosCard
    air?: CotacaoDadosCard
}

export type CotacaoResponse =
    | { notFound: true }
    | { notFound: false; dados: CotacaoCardType };
