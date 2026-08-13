import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CotacaoCompletaDados, CotacaoCompletaSchema, CotacaoDados } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";
import FormParticipantes from "../sections/FormParticipantes";
import FormMercadoriaNatureza from "../sections/FormMercadoria/FormMercadoriaNatureza";
import { ModalMercadoriaBloqueada } from "../../modals/ModalMercadoriaBloqueada";
import { useFormCompleto } from "@/hooks/useFormCompleto";
import { ButtonCotacao } from "../../ui/buttons/ButtonCotacao";
import criarCotacao from "@/services/criarCotacao";
import ModalSucessoCotacao from "../../modals/ModalSucessoCotacao";

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

  // Extrai os metodos do RHF
  const {
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
    clearErrors
  } = rhf;

  //Hook form completo
  const { erroModalAtivo, carregando, setCarregando, cotacaoSequenceCode, setCotacaoSequenceCode } = useFormCompleto(errors);

  //handler de enviar cotação
  async function handlerSubmeterCotacaoCompleta(dadosFormulario: CotacaoCompletaDados) {
    setCarregando(true);

    const responseCotacao = await criarCotacao(dadosFormulario);

    //caso não seja valido
    if (!responseCotacao.valido) {
      alert(responseCotacao.erro || "Erro desconhecido, tente novamente mais tarde...");
      setCarregando(false);
      return;
    }

    //Deu certo a partir daqui
    setCarregando(false);

    //Define o sequenceCode da cotacao
    setCotacaoSequenceCode(responseCotacao.sequenceCode);
  }

  return (
    <FormProvider {...rhf}>
      <form onSubmit={handleSubmit(handlerSubmeterCotacaoCompleta)}>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          exit={{ opacity: 0, height: 0 }}
          //Set focus no campo de remetente quando terminar animação
          onAnimationComplete={() => {
            setFocus("remetenteDoc");
          }}
          className="flex flex-col gap-7 bg-white rounded-xl px-8 py-6 drop-shadow-lg"
        >
          {/*Sections Participantes cotação*/}
          <FormParticipantes />

          {/*Sections Informações da mercadoria*/}
          <FormMercadoriaNatureza />
          <div className="flex flex-row w-full justify-end items-end">
            <ButtonCotacao carregando={carregando} type="submit">
              Criar Cotação
            </ButtonCotacao>
          </div>
        </motion.div>
      </form>

      {/* Modal de alerta */}
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

      {/* Modal de sucesso */}
      <ModalSucessoCotacao sequenceCode={cotacaoSequenceCode} fechar={setCotacaoSequenceCode} />
    </FormProvider>
  );
}
