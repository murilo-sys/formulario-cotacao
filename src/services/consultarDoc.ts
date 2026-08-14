import axios from "axios";

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, boolean>();

export default async function consultarDoc(doc: string): Promise<boolean> {
  //Se não houver doc return false
  if (!doc) return false;

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
      cacheDocumentos.set(doc, true);
      return true;
    }

    //Seta o cache como false
    cacheDocumentos.set(doc, false);

    //Return como false
    return false;
  } catch (error) {
    //Verifica se é um erro Axios
    if (axios.isAxiosError(error)) {
      //Caso o status seja 404
      if (error.status === 404) {
        cacheDocumentos.set(doc, false);
        return false;
      }
    }

    return false;
  }
}
