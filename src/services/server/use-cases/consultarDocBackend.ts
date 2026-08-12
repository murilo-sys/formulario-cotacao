import "server-only";

import axios from "axios";
import consultarPessoa from "../adapters/consultarPessoa";

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, boolean>();

export default async function consultarDocBackend(doc: string): Promise<boolean> {
  if (!doc) return false;

  //Verifica se existe no cache
  if (cacheDocumentos.has(doc)) {
    //retorna o valor caso exista
    return cacheDocumentos.get(doc)!;
  }
  try {
    //Faz a requisição
    const response = await consultarPessoa(doc);

    //Cria uma constante com o resultado da lista
    const lista = response.data?.data?.company?.edges || response.data?.data?.individual?.edges;

    //Caso esteja vazio o resultado
    if (!lista || lista?.length === 0) {
      //Seta o valor capturado no cache
      cacheDocumentos.set(doc, false);
      return false;
    }

    //
    cacheDocumentos.set(doc, true);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
    }
    return false;
  }
}
