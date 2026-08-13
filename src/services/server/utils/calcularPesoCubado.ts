import 'server-only'

import { CubagemType } from '@/schemas/cotacaoSchema';

type CubagemArrayType = CubagemType[]

export function calcularPesoCubado(cubagens: CubagemArrayType, fator: number): number {

    const totalPesoCubado = cubagens.reduce((pesoCubado, item) => {

        if (!item?.height || !item?.length || !item?.width) {
            return pesoCubado
        }

        //Return limpando com regex para transformar em Number
        return pesoCubado + (Number(item.length.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * Number(item.width.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * Number(item.height.replace(",", ".").replace(/\.(?=\d+\.)/g, '')) * fator) * Number(item.volume)
    }, 0)

    return totalPesoCubado
}