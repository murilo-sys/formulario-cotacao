import "server-only";

import axios from "axios";
import consultarPessoa from "../adapters/consultarPessoaAdapter";

type ConsultarDocBackendResponseType = { valido: true; cidade: string; estado: string; contribuinte: boolean; cep: string } | { valido: false };

export default async function consultarDocBackend(doc: string): Promise<ConsultarDocBackendResponseType> {
  if (!doc) return { valido: false };

  try {
    const resultado = await consultarPessoa(doc);

    if (!resultado.valido || !resultado.cidade || !resultado.estado || !resultado.cep) {
      return { valido: false };
    }

    return {
      valido: true,
      cidade: resultado.cidade,
      estado: resultado.estado,
      contribuinte: resultado.contribuinte,
      cep: resultado.cep
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[Erro consultarDocBackend]:", error.response?.data);
    }
    return { valido: false };
  }
}
