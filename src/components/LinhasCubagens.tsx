import { CotacaoDados } from "@/schemas/cotacaoSchema"
import { Controller, useFormContext } from "react-hook-form"
import { Input } from "./ui/inputs/Input"
import { Label } from "./ui/Label"
import { InputNumber } from "./ui/inputs/InputNumber"
import { useEffect, useRef, useState } from "react"

type LinhasCubagensType = {
    totalVolumes: string
}

export default function LinhasCubagens({ totalVolumes: totalVolumesDigitado }: LinhasCubagensType) {

    //useFormContext para importar o useForm do formulário principal "integrando" eles
    const { control, clearErrors, watch, setValue, formState: { errors }, getValues } = useFormContext<CotacaoDados>()

    //Quantidade de volumes total digitada
    const quantidadeVolumesDigitado = Number(totalVolumesDigitado) || 0

    //Array de cubagens
    const cubagens = watch('cubagens') || []

    //Auto explicativo
    // eslint-disable-next-line prefer-const
    let numeroDeLinhas = 1

    //Percorre cada item da lista de cubagens e soma quantidade
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const volumesTotais = cubagens.reduce((acumulador, item) => {
        const qtd = Number(item?.quantidade) || 0
        return acumulador + qtd
    }, 0)


    if (Number(totalVolumesDigitado) > 0) {
        numeroDeLinhas = cubagens.filter(item => Number(item.quantidade)).length + 1
    }

    //Use Effect para cortar da memória o que sobra dos valores das linhas de cubagens.
    useEffect(() => {
        const cubagensAtuais = getValues("cubagens")

        if (cubagensAtuais && cubagensAtuais.length > quantidadeVolumesDigitado) {
            if (quantidadeVolumesDigitado === 0) return
            setValue("cubagens", cubagensAtuais.slice(0, quantidadeVolumesDigitado))
        }
    }, [quantidadeVolumesDigitado, getValues, setValue])


    console.log(cubagens.length);


    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: numeroDeLinhas }).map((_, index) => (
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

                                            if (Number(e.target.value) > volumesTotais) {
                                                field.onChange(Number(e.target.value) - volumesTotais)
                                                return
                                            }

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