import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { calcularPesoCubado } from "@/services/calcularPesoCubado";
import { useFormContext } from "react-hook-form";

type PesoCubadoProps = {
    fator: 167 | 300
}

export default function PesoCubadoCard({ fator }: PesoCubadoProps) {

    //useFormContext para importar o useForm do formulário principal "integrando" eles para adquirir o watch
    const { watch } = useFormContext<CotacaoDados>()

    const cubagens = watch("cubagens") || []

    if (!cubagens || !fator) return

    const totalPesoCubado = calcularPesoCubado(cubagens, fator)

    return (
        <span>{totalPesoCubado}</span>
    )
}