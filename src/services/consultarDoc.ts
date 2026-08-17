import axios from "axios";

type cacheDocumentoType = { valido: true; cidade: string; estado: string } | { valido: false };

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, cacheDocumentoType>();

export default async function consultarDoc(doc: string) {
  //Se não houver doc return false
  if (!doc) return { valido: false };

  //Verifica se existe no cache
  if (cacheDocumentos.has(doc)) {
    //retorna o valor caso exista
    return cacheDocumentos.get(doc)!;
  }

  try {
    //Formata a url com o parametro correto
    const url = `/api/consultar-doc?documento=${doc}`;

    // Faz o get no endpoint para verificar
    const response = await axios.get(url);

    if (!response.data.notFound) {
      //Seta o valor capturado no cache
      cacheDocumentos.set(doc, {
        valido: true,
        cidade: response.data?.cidade,
        estado: response.data?.estado
      });
      return {
        valido: true,
        cidade: response.data?.cidade,
        estado: response.data?.estado
      };
    }

    //Seta o cache como false
    cacheDocumentos.set(doc, { valido: false });

    //Return como false
    return { valido: false };
  } catch (error) {
    //Verifica se é um erro Axios
    if (axios.isAxiosError(error)) {
      //Caso o status seja 404
      if (error.status === 404) {
        cacheDocumentos.set(doc, { valido: false });
        return { valido: false };
      }
    }

    return { valido: false };
  }
}
