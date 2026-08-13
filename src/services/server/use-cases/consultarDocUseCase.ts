import "server-only";

import axios from "axios";
import consultarPessoa from "../adapters/consultarPessoaAdapter";

type ConsultarDocBackendResponseType = { valido: true; cidade: string; estado: string } | { valido: false };

export default async function consultarDocBackend(doc: string): Promise<ConsultarDocBackendResponseType> {
  if (!doc)
    return {
      valido: false
    };

  try {
    //Faz a requisição
    const response = await consultarPessoa(doc);

    //Cria uma constante com o resultado da lista
    const lista = response.data?.data?.company?.edges || response.data?.data?.individual?.edges;

    //Caso esteja vazio o resultado
    if (!lista || lista?.length === 0) {
      //Seta o valor capturado no cache
      return {
        valido: false
      };
    }

    //Variaveis da consulta
    const nodeCompany = response.data?.data?.company?.edges?.[0]?.node;
    const nodeIndividual = response.data?.data?.individual?.edges?.[0]?.node;
    const node = nodeCompany || nodeIndividual;

    if (!node) return { valido: false };

    if (!node.mainAddress?.city?.name || !node.mainAddress?.city?.state?.code) return { valido: false };

    return {
      valido: true,
      cidade: node.mainAddress?.city?.name,
      estado: node.mainAddress?.city?.state?.code
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
    }
    return {
      valido: false
    };
  }
}
