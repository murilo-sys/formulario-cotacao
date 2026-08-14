import "server-only";

import { CotacaoDados } from "@/schemas/cotacaoSchema";
import axios from "axios";

interface CotacaoDadosCompleto extends CotacaoDados {
  pesoTaxado: number;
}

export async function apiSimularValor(modal: "rodo" | "air", dados: CotacaoDadosCompleto, token: string, difalOpcao: boolean) {
  //URL do endpoint
  const url = "https://globalcargo.eslcloud.com.br/api/quote/calculate_freights";

  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "*/*"
    },

    //Data substituiu o body do fetch
    data: {
      data: {
        attributes: {
          origin_postal_code: dados.cepOrigem,
          destination_postal_code: dados.cepDestino,

          // CNPJ USADO PARA CALCULO DE DIFAL
          recipient_document: `${difalOpcao ? "65971717000126" : ""}`,

          real_weight: dados.pesoTaxado,
          invoices_value: dados.valorNfe,
          invoices_volumes: dados.totalVolumes,
          modal: modal
        }
      }
    }
  });

  //Mapeia os campos
  const total = response.data?.data?.[0]?.summary?.total;
  const difal = dados.difalOpcao ? response.data?.data?.[0]?.details?.fiscal_detail?.difal_tax_value_destination : null;
  const prazo = response.data?.data?.[0]?.details?.delivery_time;
  const subtotal = response.data?.data?.[0]?.details?.subtotal;
  const impostos = response.data?.data?.[0]?.details?.fiscal_detail?.tax_value;

  if (!total || !prazo || !subtotal || !impostos) throw new Error("Não foi possivel simular cotação");

  return {
    total,
    difal,
    prazo,
    subtotal,
    impostos
  };
}
