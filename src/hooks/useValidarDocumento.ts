import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import consultarDoc from "@/services/consultarDoc";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type CampoDocumento = "remetenteDoc" | "destinatarioDoc" | "solicitanteDoc";

export function useValidarDocumento() {
  // useState endereco origem
  const [enderecoOrigem, setEnderencoOrigem] = useState<string>("");

  // useState endereco destino
  const [enderecoDestino, setEnderencoDestino] = useState<string>("");

  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const { setError, trigger } = useFormContext<CotacaoCompletaDados>();

  async function consultarDocumento(documento: string, campo: CampoDocumento): Promise<void> {
    // Faz a verificação da sintaxe usando trigger no zod
    const sintaxeValida = await trigger(campo);

    //Se não for true, retorna false
    if (!sintaxeValida) {
      if (campo === "destinatarioDoc") if (enderecoDestino.trim() !== "") setEnderencoDestino("");
      if (campo === "remetenteDoc") if (enderecoOrigem.trim() !== "") setEnderencoOrigem("");
      return;
    }

    //Consta o doc no sistema
    const consultaDoc = await consultarDoc(documento);

    //Caso não seja valido
    if (!consultaDoc.valido) {
      setError(campo, { type: "manual", message: "cadastroInexistente" });
      if (campo === "destinatarioDoc") if (enderecoDestino.trim() !== "") setEnderencoDestino("");
      if (campo === "remetenteDoc") if (enderecoOrigem.trim() !== "") setEnderencoOrigem("");
      return;
    }

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
