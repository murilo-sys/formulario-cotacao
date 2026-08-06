"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CotacaoCompletaDados,
    CotacaoCompletaSchema,
    CotacaoDados,
} from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";
import FormParticipantes from "./sections/FormParticipantes";
import FormMercadoria from "./sections/FormMercadoria";

interface FormCompletoProps {
    dadosSimulacao: CotacaoDados;
}

export default function FormCotCompleto({ dadosSimulacao }: FormCompletoProps) {
    // React-hook-form
    const rhf = useForm<CotacaoCompletaDados>({
        resolver: zodResolver(CotacaoCompletaSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            solicitanteNome: dadosSimulacao.solicitanteNome,
            solicitanteDoc: dadosSimulacao.solicitanteDoc,
            destinatarioDoc: "",
            remetenteDoc: "",
            pagadorFrete: "rem",
            cepOrigem: dadosSimulacao.cepOrigem,
            cepDestino: dadosSimulacao.cepDestino,
            valorNfe: dadosSimulacao.valorNfe,
            cubagens: [...dadosSimulacao.cubagens],
            totalVolumes: dadosSimulacao.totalVolumes,
            pesoReal: dadosSimulacao.pesoReal,
        },
    });

    // Extrai os metodos do RHF
    const { handleSubmit, setFocus } = rhf;

    //coloca Focus no campo do remetente
    setFocus("remetenteDoc");

    async function handlerSubmeterCotacaoCompleta() {
        console.log("Teste");
    }

    return (
        <FormProvider {...rhf}>
            <form onSubmit={handleSubmit(handlerSubmeterCotacaoCompleta)}>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    exit={{ opacity: 0, height: 0 }}

                    className="flex flex-col gap-7 bg-white rounded-xl px-8 py-6 drop-shadow-lg"
                >
                    {/*Sections Participantes cotação*/}
                    <FormParticipantes />

                    {/*Sections Informações da mercadoria*/}
                    <FormMercadoria />
                </motion.div>
            </form>
        </FormProvider>
    );
}
