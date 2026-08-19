import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import consultarDoc from "@/services/consultarDoc";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type CampoDocumento = "remetenteDoc" | "destinatarioDoc" | "solicitanteDoc";

export function useValidarDocumento(solicitanteValido?: (valor: boolean) => void) {
  // useState endereco origem
  const [enderecoOrigem, setEnderencoOrigem] = useState<string>("");

  // useState endereco destino
  const [enderecoDestino, setEnderencoDestino] = useState<string>("");

  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const { setError, trigger } = useFormContext<CotacaoCompletaDados>();

  async function consultarDocumento(documento: string, campo: CampoDocumento): Promise<void> {
    // Faz a verificação da sintaxe usando trigger no zod
    const sintaxeValida = await trigger(campo);

    //Verifica sintaxe, caso inválido define os endereços como vazio
    if (!sintaxeValida) {
      if (campo === "destinatarioDoc") if (enderecoDestino.trim() !== "") setEnderencoDestino("");
      if (campo === "remetenteDoc") if (enderecoOrigem.trim() !== "") setEnderencoOrigem("");
      return;
    }

    //Consta o doc no sistema
    const consultaDoc = await consultarDoc(documento);

    //Caso não seja valido
    if (!consultaDoc.valido) {
      //Caso seja campo de remetente ou destinatario, usa setError para abrir modal
      if (campo === "destinatarioDoc" || campo === "remetenteDoc") setError(campo, { type: "manual", message: "cadastroInexistente" });

      //Caso campo seja de solicitanteDoc, define que ele não é valido e não poderá criar uma cotação
      if (campo === "solicitanteDoc" && solicitanteValido) solicitanteValido(false);

      //Caso campo de destinatario ou remetente os endereços sejam diferente de "", então seta como ""
      if (campo === "destinatarioDoc") if (enderecoDestino.trim() !== "") setEnderencoDestino("");
      if (campo === "remetenteDoc") if (enderecoOrigem.trim() !== "") setEnderencoOrigem("");

      return;
    }

    //Caso campo seja de solicitanteDoc, define que ele É valido e poderá criar uma cotação
    if (campo === "solicitanteDoc" && solicitanteValido) solicitanteValido(true);

    const enderecoFormatado = `${consultaDoc.estado.trim()} - ${consultaDoc.cidade.trim()}`;

    if (campo === "remetenteDoc") {
      setEnderencoOrigem(enderecoFormatado);
    } else {
      setEnderencoDestino(enderecoFormatado);
    }
  }

  return {
    consultarDocumento,
    enderecoDestino,
    enderecoOrigem
  };
}
