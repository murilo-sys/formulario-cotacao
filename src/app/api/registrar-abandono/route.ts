import { CotacaoSchema } from "@/schemas/cotacaoSchema";
import { apiSimularValor } from "@/services/server/adapters/simularValorAdapter";
import { calcularPesoCubado } from "@/services/server/utils/calcularPesoCubado";
import { NextRequest, NextResponse } from "next/server";

const solicitanteSchema = CotacaoSchema.pick({
  solicitanteDoc: true,
  solicitanteNome: true
});

export async function POST(request: NextRequest) {
  try {
    //Lê variavel de ambiente
    const modalAereo = process.env.NEXT_PUBLIC_AIR_MODAL;

    //Body da requisição
    const body = await request.json();

    //Pega as variaveis da URL e guarda em dados
    const dados = {
      solicitanteDoc: body[0].solicitanteDoc || null,
      solicitanteNome: body[0].solicitanteNome?.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").trim() || null,
      cepOrigem: body[0].cepOrigem?.replace(/\D/g, "") || null,
      cepDestino: body[0].cepDestino?.replace(/\D/g, "") || null,
      pesoReal: body[0].pesoReal?.replace(/[^0-9]/g, "") || null,
      totalVolumes: body[0].totalVolumes?.replace(/\D/g, "") || null,
      valorNfe: body[0].valorNfe?.replace(/[^0-9.]/g, "") || null,
      cubagens: body[0].cubagens || null,
      difalOpcao: body[0].difalOpcao || null,
      totalRodo: body[1]?.dados.rodo?.total || null,
      prazoRodo: body[1]?.dados.rodo?.prazo || null,
      difalRodo: body[1]?.dados.rodo?.difal || null,
      totalAir: body[1]?.dados.air?.total || null,
      prazoAir: body[1]?.dados.air?.prazo || null,
      difalAir: body[1]?.dados.air?.difal || null
    };

    //Verifica que o nome e doc do solicitante existe
    if (dados.solicitanteDoc === null || dados.solicitanteNome === null) return NextResponse.json({ erro: "Não encontrado nome e documento do solicitante" }, { status: 400 });

    //Validacao apenas dos campos de nome e doc do solicitante
    const validacao = solicitanteSchema.safeParse(dados);

    //Verifica se o nome e o doc são validos
    if (!validacao.success) return NextResponse.json({ erro: "Nome ou Documento inválido do solicitante" }, { status: 400 });

    if (modalAereo === "false") {
      if (dados.cepOrigem && dados.cepDestino && dados.pesoReal) {
        try {
          const pesoCubado = calcularPesoCubado(dados.cubagens, 167);
          const pesoTaxado = Number(dados.pesoReal) > pesoCubado ? Number(dados.pesoReal) : pesoCubado;

          // Chama a sua função apiSimularValor existente:
          const cotAereo = await apiSimularValor("air", { ...dados, pesoTaxado }, process.env.TOKEN_API!, dados.difalOpcao);
          dados.totalAir = cotAereo.data.data[0].summary.total;
          dados.prazoAir = cotAereo.data.data[0].details.delivery_time;
          dados.difalAir = dados.difalOpcao ? cotAereo.data.data[0].details.fiscal_detail.difal_tax_value_destination : null;
        } catch {}
      }
    }

    //Hook do google sheets
    const webhookurl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    //Verifica se o webhookurl existe
    if (!webhookurl) {
      console.error("GOOGLE_SHEETS_WEBHOOK_URL não configurada no .env.local");
      return NextResponse.json({ message: "webhook ausente" }, { status: 500 });
    }

    //Faz a requisição
    await fetch(webhookurl, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao registrar cotação abandonada:", error);
    return NextResponse.json({ erro: "Falha interna ao registrar" }, { status: 500 });
  }
}
