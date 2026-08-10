import { NATUREZAS_BLOQUEADAS, OPCOES_NATUREZA } from "@/constants/naturezas";
import parseNumberBR from "@/utils/parseNumberBR";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

const chavesNatureza = OPCOES_NATUREZA.map((opcao) => opcao.value);

// prettier-ignore
export const ItemCubagemSchema = z.object({
  altura: z.string().min(1, "Altura inválida").regex(/^[0-9,]+$/, "Altura com caracteres inválidos"),
  largura: z.string().min(1, "Largura inválida").regex(/^[0-9,]+$/, "largura com caracteres inválidos"),
  comprimento: z.string().min(1, "Comprimento inválido").regex(/^[0-9,]+$/, "Comprimento com caracteres inválidos"),
  quantidade: z.string().min(1, "Quantidade inválida").regex(/^[0-9,]+$/, "Quantidade com caracteres inválidos")
});

export type CubagemType = z.infer<typeof ItemCubagemSchema>;

// prettier-ignore
export const CotacaoSchema = z.object({
  solicitanteNome: z
    .string()
    .min(4, "Informe seu nome")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "Nome inválido" }),
  solicitanteDoc: z
    .string()
    .min(11, "CPF ou CNPJ inválido")
    .refine((valor) => (valor.length === 14 ? cnpj.isValid(valor) : cpf.isValid(valor)), { message: "Documento inválido" }),
  cepOrigem: z.string().length(8, "O CEP de origem está incompleto"),
  cepDestino: z.string().length(8, "O CEP de destino está incompleto"),
  pesoReal: z
    .string()
    .min(1, "Informe o peso da carga")
    .refine((valor) => parseNumberBR(valor) > 0),
  valorNfe: z
    .string()
    .min(1, "Informe o valor da NF-e")
    .refine((valor) => parseNumberBR(valor) > 0),
  totalVolumes: z
    .string()
    .min(1, "Informe o total de volumes")
    .refine((valor) => Number(valor) > 0),
  difalOpcao: z.boolean(),
  cubagens: z.array(ItemCubagemSchema)
});

export type CotacaoDados = z.infer<typeof CotacaoSchema>;

// prettier-ignore
export const CotacaoCompletaSchema = CotacaoSchema.extend({
  destinatarioDoc: z
    .string()
    .min(11, "CPF ou CNPJ inválido")
    .refine((valor) => (valor.length === 14 ? cnpj.isValid(valor) : cpf.isValid(valor)), {
      message: "Documento inválido"
    }),
  remetenteDoc: z
    .string()
    .min(11, "CPF ou CNPJ inválido")
    .refine((valor) => (valor.length === 14 ? cnpj.isValid(valor) : cpf.isValid(valor)), {
      message: "Documento inválido"
    }),
  pesoReal: CotacaoSchema.shape.pesoReal.refine(
    (valor) => {
      return parseNumberBR(valor) < 500;
    },
    {
      message: "pesoElevado"
    }
  ),
  valorNfe: CotacaoSchema.shape.valorNfe
    .refine(
      (valor) => {
        return parseNumberBR(valor) < 250000;
      },
      {
        message: "valorElevado"
      }
    )
    .refine(
      (valor) => {
        return parseNumberBR(valor) >= 200;
      },
      {
        message: "valorBaixo"
      }
    ),
    totalVolumes: CotacaoSchema.shape.totalVolumes.refine((valor) => Number(valor) <= 200),
  pagadorFrete: z.enum(["dest", "rem"], { message: "Selecione um pagador válido" }),
  naturezaMercadoria: z.enum(chavesNatureza, { message: "Selecione uma natureza de mercadoria válida" }).refine(
    (valor) => {
      return !(NATUREZAS_BLOQUEADAS as readonly string[]).includes(valor);
    },
    { message: "naturezaBloqueada" }
  )
});

export type CotacaoCompletaDados = z.infer<typeof CotacaoCompletaSchema>;

export interface CotacaoDadosCard {
  total: string;
  difal?: string;
  prazo: string;
}

export interface CotacaoCardType {
  rodo: CotacaoDadosCard;
  air?: CotacaoDadosCard;
}

export type CotacaoResponse = { notFound: true } | { notFound: false; dados: CotacaoCardType };
