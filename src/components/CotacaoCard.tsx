export interface CotacaoCardType {
        rodo: {
            entrega: string
            coleta: string
            transferencia: string
            imposto: string
        }
        air?: {
            entrega: string
            coleta: string
            transferencia: string
            imposto: string
        }
}

interface CotacaoCardProps{
    dados: CotacaoCardType
}

export default function CotacaoCard({dados}: CotacaoCardProps) {

    return (
        <span>{dados.air?.coleta}</span>
    )

}