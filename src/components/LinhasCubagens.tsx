import { CotacaoDados } from "@/schemas/cotacaoSchema"
import { Controller, useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "./ui/inputs/Input"
import { Label } from "./ui/Label"
import { InputNumber } from "./ui/inputs/InputNumber"
import { useEffect, useRef, useState } from "react"

type LinhasCubagensType = {
    totalVolumes: string
}

export default function LinhasCubagens({ totalVolumes: totalVolumesDigitado }: LinhasCubagensType) {

    //useFormContext para importar o useForm do formulário principal "integrando" eles
    const { control, clearErrors, watch, formState: { errors } } = useFormContext<CotacaoDados>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cubagens"
    })

    //Array de cubagens
    const cubagens = watch('cubagens') || []

    // Exemplo: Se o último campo da lista tiver valor digitado, criamos +1 linha automaticamente
    const ultimaLinhaPreenchida = fields.length > 0 && Boolean(watch(`cubagens.${fields.length - 1}.quantidade`))

    const totalVolumesSomados = fields.reduce((acumulador, item) => {
        return acumulador + (Number(item?.quantidade) || 0)
    }, 0)

    console.log("fields tamanho", fields.length)

    console.log("digitado", Number(totalVolumesDigitado))

    useEffect(() => {
        if (Number(totalVolumesDigitado) <= fields.length) {
            // while (fields.length > Number(totalVolumesDigitado)) {
            //     remove(fields.length - 1)
            // }
        }

        if (Number(totalVolumesDigitado) > 0) {
            return append({ quantidade: "", comprimento: "", largura: "", altura: "" })
        }
    }, [totalVolumesDigitado])

    return (
        <div className="flex flex-col gap-1">
            {fields.map((field, index) => (
                <div key={index}>

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

                                            field.onChange(e.target.value)
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
                                    return <Input
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.comprimento?.message}
                                        id={`comprimento${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.comprimento`)
                                            field.onChange(e.target.value)
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
                                    return <Input
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.largura?.message}
                                        id={`largura${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.largura`)
                                            field.onChange(e.target.value)
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
                                    return <Input
                                        className="pl-10"
                                        ref={field.ref}
                                        prefixo="M"
                                        erro={errors.cubagens?.[index]?.altura?.message}
                                        id={`altura${index}`}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            clearErrors(`cubagens.${index}.altura`)
                                            field.onChange(e.target.value)
                                        }}
                                    />
                                }}
                            />
                        </div>

                    </div>

                </div>
            ))}
        </div>
    )
}