import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { calcularPesoCubado } from "@/services/calcularPesoCubado";
import { useFormContext } from "react-hook-form";
import { Label } from "./ui/Label";

type PesoCubadoProps = {
    fator: 167 | 300 | 0
}

export default function PesoCubadoCard({ fator }: PesoCubadoProps) {

    //useFormContext para importar o useForm do formulário principal "integrando" eles para adquirir o watch
    const { watch } = useFormContext<CotacaoDados>()

    const cubagens = watch("cubagens") || []

    if (!cubagens) return

    const totalPesoCubado = calcularPesoCubado(cubagens, fator)

    return (
        <div className="flex flex-col">
            <Label>Peso Cubado</Label>
            <span>KG: {Number(totalPesoCubado).toLocaleString("pt-BR")}</span>
        </div>
    )
}