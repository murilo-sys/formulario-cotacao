export const LISTA_INFOS_MODAL = ["naturezaBloqueada", "pesoElevado", "medidasElevadas", "erroConsulta", "cadastroInexistente"] as const;

export type TYPE_INFO_MODAL = (typeof LISTA_INFOS_MODAL)[number];
