import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { CotacaoSchema } from "@/schemas/cotacaoSchema";
import { apiSimularValor } from "@/services/back-end/apiSimularValor";
import { calcularFator } from "@/services/back-end/calcularFator";
import { calcularPesoCubado } from "@/services/back-end/calcularPesoCubado";

export async function POST(request: NextRequest) {

    const body = await request.json()

    //Pega as variaveis da URL e guarda em dados
    const dados = {
        cepOrigem: body.cepOrigem.replace(/\D/g, ""),
        cepDestino: body.cepDestino.replace(/\D/g, ""),
        peso: body.peso.replace(/[^0-9.]/g, ""),
        totalVolumes: body.totalVolumes.replace(/\D/g, ""),
        valorNfe: body.valorNfe.replace(/[^0-9.]/g, ""),
        cubagens: body.cubagens
    }

    //Faz a validação usando o zod (princio da verdade unica)
    const validacao = await CotacaoSchema.safeParseAsync(dados)

    //Caso a validacao não tenha sido um sucesso
    if (!validacao.success) {

        // Map para filtrar os valores e formatar
        const errors = validacao.error.issues.map(erro => ({
            campo: erro.path[0],
            mensagem: erro.message
        }))

        //Faz o return do nextResponse com as informações
        return NextResponse.json({ message: "Dados inválidos", errors }, { status: 400 })
    }

    //Caso o cepDestino ou cepOrigem for fator 300, então é fator 300 geral
    const fator = await calcularFator(validacao.data.cepDestino) == 300 || await calcularFator(validacao.data.cepOrigem) == 300 ? 300 : 167

    //Calcula o peso cubado
    const pesoCubado = calcularPesoCubado(dados.cubagens, fator)

    const pesoTaxado = Number(validacao.data.peso) > pesoCubado ? validacao.data.peso : String(pesoCubado)

    console.log("peso taxado", pesoTaxado);

    validacao.data.peso = pesoTaxado

    // Começa requisição das simulações
    const token = process.env.TOKEN_API

    // Verifica se o token existe
    if (!token) {
        console.error("Chave de API não cadastrada")
        return NextResponse.json({ message: "Erro interno. Tente novamente mais tarde." }, { status: 500 })
    }

    // Cria a variavel resultado
    const resultado: { rodo?: unknown; air?: unknown } = {}

    // REQUISIÇÃO MODAL RODOVIÁRIO
    try {

        //Faz a requisição
        const cotacaoRodo = await apiSimularValor("rodo", validacao.data, token)

        //Caso tenha sido um sucesso, faz um "push" para dentro do resultado
        resultado.rodo = cotacaoRodo.data

    } catch (error) {

        //Verifica se o error é do "tipo" Axios
        if (axios.isAxiosError(error)) {

            // Caso seja erro 404, não faz nada
            if (error.response && error.response.status === 404) {

            } else {

                //Printa o erro caso não seja 404
                console.error(error.message);
            }

        }

    }

    // REQUISIÇÃO MODAL AÉREO
    try {

        //Faz a requisição
        const cotacaoAereo = await apiSimularValor("air", validacao.data, token)

        //Caso tenha sido um sucesso, faz um "push" para dentro do resultado
        resultado.air = cotacaoAereo.data

    } catch (error) {

        //Verifica se o error é do "tipo" Axios
        if (axios.isAxiosError(error)) {

            // Caso seja erro 404, não faz nada
            if (error.response && error.response.status === 404) {

            } else {

                //Printa o erro caso não seja 404
                console.error(error.message);
            }
        }

    }

    //Verifica o tamanho do objeto/array
    if (Object.keys(resultado).length === 0) {
        return NextResponse.json({ message: "Não foi possível simular a cotação" }, { status: 404 })
    }

    //Caso dê sucesso, retorna o resultado
    return NextResponse.json({ ...resultado }, { status: 200 })

}



