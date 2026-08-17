import { LISTA_INFOS_MODAL, TYPE_INFO_MODAL } from "@/constants/modalAlertas";
import { CotacaoCompletaDados, CotacaoValoresConfirmacaoType } from "@/schemas/cotacaoSchema";
import criarCotacao from "@/services/criarCotacao";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";

export function useFormCompleto(errors: FieldErrors<CotacaoCompletaDados>) {
  //useState da animação botão carregando
  const [carregando, setCarregando] = useState<true | false>(false);

  //Sequence code da cotação
  const [cotacaoSequenceCode, setCotacaoSequenceCode] = useState<number | null>(null);

  //Valores da simulação para confirmar
  const [cotacaoValoresConfirmacao, setCotacaoValoresConfirmacao] = useState<CotacaoValoresConfirmacaoType | null>(null);

  // Guarda os dados preenchidos temporariamente para usar no momento da aprovação
  const [dadosFormularioSalvos, setDadosFormularioSalvos] = useState<CotacaoCompletaDados | null>(null);

  //consulta se existe erros
  const entradasErros = Object.entries(errors);
  const erroEncontrado = entradasErros.find(([, erro]) => {
    return erro?.message && LISTA_INFOS_MODAL.includes(erro.message as TYPE_INFO_MODAL);
  });

  //Formata erroEncontrado para erroModalAtivo
  const erroModalAtivo = erroEncontrado ? { campo: erroEncontrado[0] as keyof CotacaoCompletaDados, tipo: erroEncontrado[1]?.message as TYPE_INFO_MODAL } : null;

  // Usuário APROVOU no Modal de Confirmação
  async function handleCriarCotacao(aprovado: boolean) {
    setCotacaoValoresConfirmacao(null); // Fecha o modal de confirmação
    if (!dadosFormularioSalvos) return;

    //Caso a cotação esteja aprovada
    if (aprovado) {
      setCarregando(true);
    }

    try {
      const responseCriar = await criarCotacao(dadosFormularioSalvos);

      if (!responseCriar.valido) {
        alert(responseCriar.erro || "Não foi possível criar a cotação.");
        return;
      }

      // Abre o Modal de Sucesso com o sequenceCode Caso a cotação esteja aprovada
      if (aprovado) {
        setCotacaoSequenceCode(responseCriar.sequenceCode);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao criar cotação. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return {
    erroModalAtivo,
    carregando,
    setCarregando,
    cotacaoSequenceCode,
    setCotacaoSequenceCode,
    cotacaoValoresConfirmacao,
    setCotacaoValoresConfirmacao,
    handleAprovarCotacao: handleCriarCotacao,
    dadosFormularioSalvos,
    setDadosFormularioSalvos
  };
}
