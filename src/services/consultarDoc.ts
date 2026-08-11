import axios from "axios";

// Cache em memória dos documentos já consultados
const cacheDocumentos = new Map<string, boolean>();

export default async function consultarDoc(doc: string): Promise<boolean> {
  if (!doc) return false;

  //Formata a url com o parametro correto
  const url = `/api/consultar-doc?documento=${doc}`;

  //Verifica se existe no cache
  if (cacheDocumentos.has(doc)) {
    console.log("usando cache");

    //retorna o valor caso exista
    return cacheDocumentos.get(doc)!;
  }

  try {
    // Faz o get no endpoint para verificar
    const response = await axios.get(url);

    if (!response.data.notFound) {
      //Seta o valor capturado no cache
      cacheDocumentos.set(doc, true);
      return true;
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status !== 404) {
        console.log(error.message);
      }
    }

    return false;
  }
}
