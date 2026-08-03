import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { CotacaoSchema } from "@/schemas/cotacaoSchema";
import { apiSimularValor } from "@/services/backend/apiSimularValor";
import { calcularFator } from "@/services/backend/calcularFator";
import { calcularPesoCubado } from "@/services/backend/calcularPesoCubado";

export async function POST(request: NextRequest) {

    //Lê o body da requisição
    const body = await request.json()

    //Pega as variaveis da URL e guarda em dados
    const dados = {
        cepOrigem: body.cepOrigem.replace(/\D/g, ""),
        cepDestino: body.cepDestino.replace(/\D/g, ""),
        pesoReal: body.pesoReal.replace(/[^0-9.]/g, ""),
        totalVolumes: body.totalVolumes.replace(/\D/g, ""),
        valorNfe: body.valorNfe.replace(/[^0-9.]/g, ""),
        cubagens: body.cubagens,
        difalOpcao: body.difalOpcao
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

    //Verifica qual é o maior
    const pesoTaxado = Number(validacao.data.pesoReal) > pesoCubado ? Number(validacao.data.pesoReal) : pesoCubado

    //Cria uma constante com todos os dados validados, incluindo o pesoCubado e o pesoTaxado
    const dadosValidados = {
        ...validacao.data,
        pesoCubado,
        pesoTaxado
    }

    // Começa requisição das simulações
    const token = process.env.TOKEN_API

    // Verifica se o token existe
    if (!token) {
        console.error("Chave de API não cadastrada")
        return NextResponse.json({ message: "Erro interno. Tente novamente mais tarde." }, { status: 500 })
    }

    // Cria a variavel resultado
    const resultado = {} as { rodo: { dados: { total: string, difal?: string, prazo: string }, pesoTaxado: number }, air?: { dados: { total: string, difal?: string, prazo: string }, pesoTaxado: number } }

    // REQUISIÇÃO MODAL RODOVIÁRIO
    try {

        //Faz a requisição
        const cotacaoRodo = await apiSimularValor("rodo", dadosValidados, token, dadosValidados.difalOpcao)

        //Caso tenha sido um sucesso, faz um "push" para dentro do resultado
        resultado.rodo = {
            dados: {
                total: cotacaoRodo.data.data[0].summary.total,
                difal: dadosValidados.difalOpcao ? cotacaoRodo.data.data[0].details.fiscal_detail.difal_tax_value_destination : null,
                prazo: cotacaoRodo.data.data[0].details.delivery_time
            },
            pesoTaxado: dadosValidados.pesoTaxado
        }

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

    //Lê a variavel AIR_MODAL
    const modalAereo = process.env.NEXT_PUBLIC_AIR_MODAL

    //Se o modalAereo estiver permitido, faz a consulta
    if (modalAereo === "true") {
        try {

            //AIR é sempre 167 o fator. Caso tenha vindo fator 300 no modal AIR, transforma para 167
            if (fator === 300) {
                dadosValidados.pesoCubado = (Number(dadosValidados.pesoCubado) / 300) * 167

                dadosValidados.pesoTaxado = Number(validacao.data.pesoReal) > dadosValidados.pesoCubado ? Number(validacao.data.pesoReal) : dadosValidados.pesoCubado
            }

            //Faz a requisição no modal aéreo
            const cotacaoAereo = await apiSimularValor("air", dadosValidados, token, dadosValidados.difalOpcao)

            //Valida se existe .air para typescript não acusar erro
            if (!resultado.air) {
                resultado.air = {
                    dados: {
                        total: cotacaoAereo.data.data[0].summary.total,
                        difal: dadosValidados.difalOpcao ? cotacaoAereo.data.data[0].details.fiscal_detail.difal_tax_value_destination : null,
                        prazo: cotacaoAereo.data.data[0].details.delivery_time
                    },
                    pesoTaxado: dadosValidados.pesoTaxado
                }
            }

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
    }

    //Verifica o tamanho do objeto/array
    if (Object.keys(resultado).length === 0) {
        return NextResponse.json({ message: "Não foi possível simular a cotação" }, { status: 404 })
    }

    //Caso dê sucesso, retorna o resultado
    return NextResponse.json({ ...resultado }, { status: 200 })

}



