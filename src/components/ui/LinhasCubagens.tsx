"use client"

import { CotacaoDados } from "@/schemas/cotacaoSchema"
import { Controller, useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "./inputs/Input"
import { Label } from "./Label"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { InputMedida } from "./inputs/InputMedida"

type LinhasCubagensType = {
    totalVolumes: string
}

//Usado para o ESLINT não ficar acusando erro de criar um novo array a cada render.
const ARRAY_VAZIO: never[] = []

export default function LinhasCubagens({ totalVolumes: totalVolumesDigitado }: LinhasCubagensType) {

    //useFormContext para importar o useForm do formulário principal "integrando" eles
    const { control, clearErrors, setValue, watch, formState: { errors } } = useFormContext<CotacaoDados>()

    //useFielArray usado para lista de forma dinamica
    const { fields, append, remove } = useFieldArray({
        control,
        name: "cubagens"
    })

    //Array de cubagens
    const cubagens = watch('cubagens') || ARRAY_VAZIO

    //Soma a quantidade total de volumes de todas as linhas
    const totalVolumesSomados = cubagens.reduce((acumulador, item) => {
        return acumulador + (Number(item?.quantidade) || 0)
    }, 0)

    //Campos validos são aqueles que tem a quantidade/volumes preenchidos
    const camposValidos = cubagens.reduce((validos, atual) => {
        if (Number(atual.quantidade) >= 1) {
            return validos + 1
        }
        return validos
    }, 0)


    useEffect(() => {

        //Se zerado ou nulo
        if (!totalVolumesDigitado || totalVolumesDigitado.trim() == "" || totalVolumesDigitado == "0") return

        //Para criar uma nova linha, o TOTAL VOLUMES SOMADOS precisar ser diferente de TOTAL VOLUMES DIGITADOS
        if (Number(totalVolumesDigitado) > totalVolumesSomados) {

            //Se os campos validos não forem iguais a quantidade de linhas. RETURN
            if (camposValidos !== fields.length) return

            append({ quantidade: "", comprimento: "", largura: "", altura: "" }, { shouldFocus: false })
        }


        //Para remover a ultima linhas caso as cubagens estejam todas preenchidas
        if (Number(totalVolumesDigitado) === totalVolumesSomados && (camposValidos + 1 === fields.length)) {
            remove(fields.length - 1)
        }

        //Para apagar as linhas caso o total de volumes seja maior que os somados
        if (Number(totalVolumesDigitado) < totalVolumesSomados) {

            //Caso for a ultima linha
            if (fields.length === 1) {
                setValue("cubagens.0.quantidade", totalVolumesDigitado)
                return
            }

            //Caso a ultima linha se fosse tirada, ela seria menor que o valor total
            if ((Number(totalVolumesSomados) - Number(cubagens[fields.length - 1].quantidade)) < Number(totalVolumesDigitado)) {

                //Faz essa formula que nem eu entendi como eu fiz, mas retorna o valor 
                // const valorUltimaLinha = Math.abs((Number(totalVolumesSomados) - Number(cubagens[fields.length - 1].quantidade)) - Number(totalVolumesDigitado))

                //Seta o valor na cubagem
                setValue(`cubagens.${fields.length - 1}.quantidade`, "")

                return
            }

            //Remove a ultima linha
            remove(fields.length - 1)

        }

    }, [append, camposValidos, cubagens, fields.length, remove, setValue, totalVolumesDigitado, totalVolumesSomados])

    return (
        <div className="flex flex-col gap-1">
            {fields.map((field, index) => (
                <motion.div

                    // Verifica se é a primeira linha e não coloca a animação
                    initial={index === 0 ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    exit={{ opacity: 0, height: 0 }}
                    key={field.id}>

                    <div className="flex flex-col border-b pb-3 border-blue-500 border-dotted lg:border-none lg:grid lg:grid-cols-4 lg:grid-rows-1 gap-3">

                        <div className="flex flex-col">
                            <Label htmlFor={`quantidade${index}`} className="font-light" obrigatorio={true}>Volumes</Label>
                            <Controller
                                name={`cubagens.${index}.quantidade`}
                                control={control}
                                render={({ field }) => {
                                    return <Input
                                        className="pl-12"
                                        ref={field.ref}
                                        prefixo="UN"
                                        erro={errors.cubagens?.[index]?.quantidade?.message}
                                        id={`quantidade${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.quantidade`)

                                            // soma os volumes das outras linhas exceto a atual.
                                            const volumesOutrasLinhas = cubagens.reduce((acumulador, item, i) => {
                                                if (i === index) return acumulador; // Ignora a própria linha!
                                                return acumulador + (Number(item?.quantidade) || 0);
                                            }, 0);

                                            // O máximo que esta linha pode ter é o total MENOS as outras linhas
                                            const maxPermitido = Number(totalVolumesDigitado) - volumesOutrasLinhas
                                            const valorDigitado = Number(e.target.value) || 0

                                            if (valorDigitado > maxPermitido) {
                                                field.onChange(String(maxPermitido))
                                                return
                                            }

                                            field.onChange(e.target.value);
                                        }}
                                    />
                                }}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Label htmlFor={`comprimento${index}`} className="font-light" obrigatorio={true}>Comprimento</Label>
                            <Controller
                                name={`cubagens.${index}.comprimento`}
                                control={control}
                                render={({ field }) => {
                                    return <InputMedida
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.comprimento?.message}
                                        id={`comprimento${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.comprimento`)
                                            field.onChange(e)


                                        }}
                                    />
                                }}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Label htmlFor={`largura${index}`} className="font-light" obrigatorio={true}>Largura</Label>
                            <Controller
                                name={`cubagens.${index}.largura`}
                                control={control}
                                render={({ field }) => {
                                    return <InputMedida
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.largura?.message}
                                        id={`largura${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.largura`)
                                            field.onChange(e)
                                        }}
                                    />
                                }}
                            />
                        </div>

                        <div className="flex flex-col">
                            <Label htmlFor={`altura${index}`} className="font-light" obrigatorio={true}>Altura</Label>
                            <Controller
                                name={`cubagens.${index}.altura`}
                                control={control}
                                render={({ field }) => {
                                    return <InputMedida
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.altura?.message}
                                        id={`altura${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.altura`)
                                            field.onChange(e)
                                        }}
                                    />
                                }}
                            />
                        </div>

                    </div>

                </motion.div>
            ))}
        </div>
    )
}