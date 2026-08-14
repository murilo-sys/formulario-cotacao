import { LISTA_INFOS_MODAL, TYPE_INFO_MODAL } from "@/constants/modalAlertas";
import { CotacaoCompletaDados, CotacaoValoresConfirmacaoType } from "@/schemas/cotacaoSchema";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";

export function useFormCompleto(errors: FieldErrors<CotacaoCompletaDados>) {
  //useState da animação botão carregando
  const [carregando, setCarregando] = useState<true | false>(false);

  //Sequence code da cotação
  const [cotacaoSequenceCode, setCotacaoSequenceCode] = useState<number | null>(null);

  //Valores da simulação para confirmar
  const [cotacaoValoresConfirmacao, setCotacaoValoresConfirmacao] = useState<CotacaoValoresConfirmacaoType | null>(null);

  //consulta se existe erros
  const entradasErros = Object.entries(errors);
  const erroEncontrado = entradasErros.find(([, erro]) => {
    return erro?.message && LISTA_INFOS_MODAL.includes(erro.message as TYPE_INFO_MODAL);
  });

  //Formata erroEncontrado para erroModalAtivo
  const erroModalAtivo = erroEncontrado ? { campo: erroEncontrado[0] as keyof CotacaoCompletaDados, tipo: erroEncontrado[1]?.message as TYPE_INFO_MODAL } : null;

  return {
    erroModalAtivo,
    carregando,
    setCarregando,
    cotacaoSequenceCode,
    setCotacaoSequenceCode,
    cotacaoValoresConfirmacao,
    setCotacaoValoresConfirmacao
  };
}
