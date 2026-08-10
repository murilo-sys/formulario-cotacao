import { LISTA_INFOS_MODAL, TYPE_INFO_MODAL } from "@/constants/modalAlertas";
import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import { FieldErrors } from "react-hook-form";

export function useFormCompleto(errors: FieldErrors<CotacaoCompletaDados>) {
  //consulta se existe erros
  const entradasErros = Object.entries(errors);
  const erroEncontrado = entradasErros.find(([, erro]) => erro?.message && LISTA_INFOS_MODAL.includes(erro.message as TYPE_INFO_MODAL));

  //Formata erroEncontrado para erroModalAtivo
  const erroModalAtivo = erroEncontrado ? { campo: erroEncontrado[0] as keyof CotacaoCompletaDados, tipo: erroEncontrado[1]?.message as TYPE_INFO_MODAL } : null;

  return {
    erroModalAtivo
  };
}
