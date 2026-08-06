"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { mascaraCpfCnpj } from "@/utils/mascaras";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/inputs/Input";
import { Label } from "@/components/ui/Label";

type FormSolicitanteProps = {
    solicitanteVerificadoAction: (valor: boolean) => void;
};

export default function FormSolicitante({
    solicitanteVerificadoAction: solicitanteVerificado,
}: FormSolicitanteProps) {
    //useFormContext para importar o useForm do formulário principal "integrando" eles
    const {
        control,
        trigger,
        clearErrors,
        formState: { errors },
    } = useFormContext<CotacaoDados>();

    async function validarCampos() {
        const valoresValidos = await trigger([
            "solicitanteDoc",
            "solicitanteNome",
        ]);

        if (!valoresValidos) return;

        solicitanteVerificado(true);
    }

    return (
        <motion.div
            className="flex flex-col px-1 gap-2 overflow-hidden"
            animate={{ height: "auto" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            exit={{ height: 0 }}
        >
            <div>
                <h2 className="font-bold text-xl ">Dados do solicitante</h2>
                <p className="text-gray-500 text-md font-light">
                    Informações de quem está solicitando a cotação
                </p>
            </div>

            {/* Solicita CNPJ e NOME do solicitante */}
            <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full">
                <div className="lg:w-[43%] flex flex-col">
                    <Label obrigatorio={true} htmlFor="solicitanteDoc">
                        Documento do solicitante
                    </Label>
                    <Controller
                        name="solicitanteDoc"
                        control={control}
                        render={({ field }) => (
                            <Input
                                ref={field.ref}
                                placeholder="CPF ou CNPJ"
                                erro={errors.solicitanteDoc?.message}
                                id="solicitanteDoc"
                                type="text"
                                mask={mascaraCpfCnpj}
                                onBlur={() => {
                                    if (field.value.trim() === "") return;
                                    trigger("solicitanteDoc");
                                    field.onBlur();
                                }}
                                value={field.value}
                                onAccept={(valor) => {
                                    clearErrors("solicitanteDoc");
                                    field.onChange(valor);
                                }}
                            />
                        )}
                    />
                </div>

                <div className="lg:w-[43%] flex flex-col">
                    <Label obrigatorio={true} htmlFor="solicitanteNome">
                        Nome do solicitante
                    </Label>
                    <Controller
                        name="solicitanteNome"
                        control={control}
                        render={({ field }) => (
                            <Input
                                ref={field.ref}
                                placeholder="Nome e Sobrenome"
                                erro={errors.solicitanteNome?.message}
                                id="solicitanteNome"
                                type="text"
                                value={field.value}
                                onBlur={() => {
                                    if (field.value.trim() === "") return;
                                    trigger("solicitanteNome");
                                    field.onBlur();
                                }}
                                onChange={(e) => {
                                    clearErrors("solicitanteNome");
                                    field.onChange(e.target.value);
                                }}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-rol justify-end">
                <button
                    className="flex flex-row gap-2 rounded-2xl bg-blue-500 py-2 px-3 text-white cursor-pointer hover:-translate-y-0.5
                        transition-all active:scale-95"
                    onClick={validarCampos}
                    type="button"
                >
                    Avançar
                </button>
            </div>
        </motion.div>
    );
}
