"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { CotacaoCompletaDados, CotacaoCompletaSchema, CotacaoDados } from "@/schemas/cotacaoSchema";
import { motion } from "framer-motion";

interface FormCompletoProps {
    dadosSimulacao: CotacaoDados
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
            cubagens: [{ quantidade: "", comprimento: "", largura: "", altura: "" }]
        }
    })


    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            exit={{ opacity: 0, height: 0 }}

            className="bg-white rounded-xl p-3"
        >
            <span>Outro formulario</span>
        </motion.div>
    )

}