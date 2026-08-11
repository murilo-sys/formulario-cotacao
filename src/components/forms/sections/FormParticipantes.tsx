"use client";

import { Controller, useFormContext } from "react-hook-form";
import { mascaraCpfCnpj } from "@/utils/mascaras";
import { Input } from "@/components/ui/inputs/Input";
import { Label } from "@/components/ui/Label";
import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import { useValidarDocumento } from "@/hooks/useValidarDocumento";

export default function FormParticipantes() {
  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const {
    control,
    clearErrors,
    formState: { errors }
  } = useFormContext<CotacaoCompletaDados>();

  const { consultarDocumento } = useValidarDocumento();

  const classNameBase = "p-1 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer w-full flex justify-center border border-blue-200 rounded-md ";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div>
          <h2 className="font-bold text-xl">Dados dos participantes</h2>
          <p className="text-gray-500 text-md font-light">Informações dos participantes da cotação</p>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full">
          <div className="lg:w-[43%] flex flex-col">
            <Label obrigatorio={true} htmlFor="remetenteDoc">
              Documento do remetente
            </Label>

            {/*Input documento do remetente*/}
            <Controller
              name="remetenteDoc"
              control={control}
              render={({ field }) => (
                <Input
                  ref={field.ref}
                  placeholder="CPF ou CNPJ"
                  erro={errors.remetenteDoc?.message}
                  id="remetenteDoc"
                  type="text"
                  mask={mascaraCpfCnpj}
                  onBlur={() => {
                    if (field.value.trim() === "") return;
                    consultarDocumento(field.value, "remetenteDoc");
                    field.onBlur();
                  }}
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("remetenteDoc");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>

          {/*Input documento destinatário*/}
          <div className="lg:w-[43%] flex flex-col">
            <Label obrigatorio={true} htmlFor="destinatarioDoc">
              Documento do destinatário
            </Label>

            <Controller
              name="destinatarioDoc"
              control={control}
              render={({ field }) => (
                <Input
                  ref={field.ref}
                  placeholder="CPF ou CNPJ"
                  erro={errors.destinatarioDoc?.message}
                  id="destinatarioDoc"
                  type="text"
                  mask={mascaraCpfCnpj}
                  onBlur={() => {
                    if (field.value.trim() === "") return;
                    consultarDocumento(field.value, "destinatarioDoc");
                    field.onBlur();
                  }}
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("destinatarioDoc");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/*Pagador do frete*/}
      <div>
        <h3 className="font-bold text-lg">Pagador do frete</h3>

        <Controller
          name="pagadorFrete"
          control={control}
          render={({ field }) => (
            <div className="flex flex-row gap-3 w-full">
              {/*input remetente*/}
              <label className={`${classNameBase} ${field.value === "rem" ? "bg-blue-800 text-white" : "bg-blue-100 text-black"}`}>
                <input type="radio" name={field.name} value="rem" checked={field.value === "rem"} onChange={() => field.onChange("rem")} className="appearance-none" />
                <span className="font-medium">Remetente</span>
              </label>

              {/*Input destinatario*/}
              <label className={`${classNameBase} ${field.value === "dest" ? "bg-blue-800 text-white" : "bg-blue-100 text-black"}`}>
                <input type="radio" name={field.name} value="dest" checked={field.value === "dest"} onChange={() => field.onChange("dest")} className="appearance-none" />
                <span className="font-medium">Destinatário</span>
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}
