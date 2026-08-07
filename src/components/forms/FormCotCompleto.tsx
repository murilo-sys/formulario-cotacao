"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CotacaoCompletaDados, CotacaoCompletaSchema, CotacaoDados } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";
import FormParticipantes from "./sections/FormParticipantes";
import FormMercadoriaNatureza from "./sections/FormMercadoria/FormMercadoriaNatureza";
import { useMemo } from "react";
import { ListaInfosDialog, TipoInfoDialog } from "../modals/ModalMercadoriaBloqueada";

interface FormCompletoProps {
  dadosSimulacao: CotacaoDados;
}

export default function FormCotCompleto({ dadosSimulacao }: FormCompletoProps) {
  // React-hook-form
  const rhf = useForm<CotacaoCompletaDados>({
    resolver: zodResolver(CotacaoCompletaSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      solicitanteNome: dadosSimulacao.solicitanteNome ?? "",
      solicitanteDoc: dadosSimulacao.solicitanteDoc ?? "",
      destinatarioDoc: "",
      remetenteDoc: "",
      pagadorFrete: "rem",
      cepOrigem: dadosSimulacao.cepOrigem ?? "",
      cepDestino: dadosSimulacao.cepDestino ?? "",
      valorNfe: dadosSimulacao.valorNfe ?? "",
      cubagens: [...dadosSimulacao.cubagens],
      totalVolumes: dadosSimulacao.totalVolumes ?? "",
      pesoReal: dadosSimulacao.pesoReal ?? ""
    }
  });

  // Extrai os metodos do RHF
  const {
    handleSubmit,
    setFocus,
    formState: { errors }
  } = rhf;

  //handler de enviar cotação
  async function handlerSubmeterCotacaoCompleta() {
    console.log("Teste");
  }

  //consulta se existe erros de forma otimizada usando useMemo()
  const tipoDialog = useMemo(() => {
    const errorsTipo = Object.values(errors)
      .map((error) => error?.message)
      .filter((mensagem): mensagem is TipoInfoDialog => {
        return ListaInfosDialog.includes(mensagem as TipoInfoDialog);
      });

    return errorsTipo;
  }, [errors]);

  console.log(tipoDialog);

  function fecharDialog() {
    const campoAfetado = Object.entries(errors).find(([campo, campoObj]) => {
      if (campoObj.message && campoObj.message === tipoDialog[0]) {
        return campo;
      }
    });

    return campoAfetado;
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
        </motion.div>
      </form>
    </FormProvider>
  );
}
