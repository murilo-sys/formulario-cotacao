import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CotacaoCompletaDados, CotacaoCompletaSchema, CotacaoDados } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";
import FormParticipantes from "./sections/FormParticipantes";
import FormMercadoriaNatureza from "./sections/FormMercadoria/FormMercadoriaNatureza";
import { ModalMercadoriaBloqueada } from "./../modals/ModalMercadoriaBloqueada";
import { useFormCompleto } from "@/hooks/useFormCompleto";
import { ButtonCotacao } from "./../ui/buttons/ButtonCotacao";
import { simularCotacao } from "@/services/simularCotacao";
import ModalSucessoCotacao from "./../modals/ModalSucessoCotacao";
import ModalConfirmacaoCotacao from "../modals/ModalConfirmacaoCotacao";
import axios from "axios";

interface FormCompletoProps {
  dadosSimulacao?: CotacaoDados;
}

export default function FormCotCompleto({ dadosSimulacao }: FormCompletoProps) {
  // React-hook-form
  const rhf = useForm<CotacaoCompletaDados>({
    resolver: zodResolver(CotacaoCompletaSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      solicitanteNome: dadosSimulacao?.solicitanteNome || "",
      solicitanteDoc: dadosSimulacao?.solicitanteDoc || "",
      destinatarioDoc: "",
      remetenteDoc: "",
      pagadorFrete: "rem",
      valorNfe: dadosSimulacao?.valorNfe ?? "",
      cubagens: dadosSimulacao?.cubagens.length ? [...dadosSimulacao.cubagens] : [{ volume: "", length: "", width: "", height: "" }],
      totalVolumes: dadosSimulacao?.totalVolumes ?? "",
      pesoReal: dadosSimulacao?.pesoReal ?? ""
    }
  });

  const {
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
    clearErrors
  } = rhf;

  // Custom hook para estados do formulário completo
  const { erroModalAtivo, carregando, setCarregando, cotacaoSequenceCode, setCotacaoSequenceCode, cotacaoValoresConfirmacao, setCotacaoValoresConfirmacao, setDadosFormularioSalvos, handleAprovarCotacao } = useFormCompleto(errors);

  // Submissão do Formulário: Executa a Simulação dos valores e abre o Modal de Confirmação
  async function handlerSubmeterCotacaoCompleta(dadosFormulario: CotacaoCompletaDados) {
    setCarregando(true);
    setDadosFormularioSalvos(dadosFormulario);

    try {
      const responseSimulacao = await simularCotacao(dadosFormulario);

      if (responseSimulacao.notFound) {
        alert("Trecho ou cotação não disponível para simulação.");
        setCarregando(false);
        return;
      }

      // Prepara os valores confirmados para exibir no modal
      const rodo = responseSimulacao.dados.rodo;
      setCotacaoValoresConfirmacao({
        total: rodo.total,
        prazo: rodo.prazo,
        difal: rodo.difal || "0",
        subtotal: rodo.subtotal,
        impostos: rodo.impostos || "0"
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            valido: false,
            erro: `${error.response?.data?.[0]?.campo || ""} ${error.response?.data?.[0]?.erro}`
          };
        }
      }
      console.error(error);
      alert("Ocorreu um erro durante a simulação dos valores. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <FormProvider {...rhf}>
      <form onSubmit={handleSubmit(handlerSubmeterCotacaoCompleta)}>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={{ opacity: 0, height: 0 }}
          onAnimationComplete={() => {
            setFocus("remetenteDoc");
          }}
          className="flex flex-col gap-7 bg-white rounded-xl px-8 py-6 drop-shadow-lg"
        >
          {/* Seção Participantes */}
          <FormParticipantes />

          {/* Seção Informações da Mercadoria */}
          <FormMercadoriaNatureza />

          <div className="flex flex-row w-full justify-end items-end">
            <ButtonCotacao carregando={carregando} type="submit">
              Criar Cotação
            </ButtonCotacao>
          </div>
        </motion.div>
      </form>

      {/* Modal de alerta de mercadoria bloqueada */}
      {erroModalAtivo && (
        <ModalMercadoriaBloqueada
          info={erroModalAtivo?.tipo}
          fechar={() => {
            setValue(erroModalAtivo?.campo, "");
            clearErrors(erroModalAtivo?.campo);
            setFocus(erroModalAtivo?.campo);
          }}
        />
      )}

      {/* Modal de Confirmação de Valores (Aprovar / Recusar) */}
      <ModalConfirmacaoCotacao
        valoresConfirmacao={cotacaoValoresConfirmacao}
        onAprovar={() => {
          handleAprovarCotacao(true);
        }}
        onRecusar={() => {
          handleAprovarCotacao(false);
        }}
      />

      {/* Modal de Sucesso da Cotação (Sequence Code) */}
      <ModalSucessoCotacao sequenceCode={cotacaoSequenceCode} fechar={() => setCotacaoSequenceCode(null)} />
    </FormProvider>
  );
}
