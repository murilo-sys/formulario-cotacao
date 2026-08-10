"use client";

import { Input } from "@/components/ui/inputs/Input";
import { InputNumber } from "@/components/ui/inputs/InputNumber";
import { Label } from "@/components/ui/Label";
import LinhasCubagens from "@/components/ui/LinhasCubagens";
import { OPCOES_NATUREZA } from "@/constants/naturezas";
import { CotacaoCompletaDados } from "@/schemas/cotacaoSchema";
import { Controller, useFormContext } from "react-hook-form";

export default function FormMercadoria() {
  //useFormContext para importar o useForm do formulário principal "integrando" eles
  const {
    control,
    clearErrors,
    trigger,
    formState: { errors }
  } = useFormContext<CotacaoCompletaDados>();

  return (
    <div className="flex flex-col gap-2">
      {/* Cabeçalho dados da mercadoria */}
      <div>
        <h2 className="font-bold text-xl ">Dados da mercadoria</h2>
        <p className="text-gray-500 text-md font-light">Informações das cargas que serão despachadas</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:grid lg:grid-row-2 lg:grid-cols-12  lg:gap-3 w-full">
          {/* Input Natureza Mercadoria */}
          <div className="flex flex-col lg:row-span-1 lg:col-span-12">
            <Label obrigatorio={true} htmlFor="naturezaMercadoria">
              Natureza da mercadoria
            </Label>

            <Controller
              name="naturezaMercadoria"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`transition-all duration-300 border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.naturezaMercadoria?.message && "bg-red-100 animate-shake"}`}
                  id="naturezaMercadoria"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("naturezaMercadoria");
                  }}
                >
                  {/* Opção padrão quando inicia */}
                  <option value="" disabled hidden>
                    Selecione...
                  </option>

                  {/* Faz um map e adiciona dinamicamente as options */}
                  {OPCOES_NATUREZA.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Input total de volumes */}
          <div className="flex flex-col lg:col-span-4">
            <Label obrigatorio={true} htmlFor="totalVolumes">
              Total de Volumes
            </Label>

            <Controller
              name="totalVolumes"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="w-full pl-12"
                  prefixo="UN"
                  erro={errors.totalVolumes?.message}
                  id="totalVolumes"
                  type="text"
                  ref={field.ref}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("totalVolumes");
                    if (Number(e.target.value) > 200) {
                      field.onChange("200");
                      return;
                    }
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />
          </div>

          {/* Input Peso Real */}
          <div className="flex flex-col lg:col-span-4">
            <Label obrigatorio={true} htmlFor="pesoReal">
              Peso Real
            </Label>

            <Controller
              name="pesoReal"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  ref={field.ref}
                  className="w-full pl-11"
                  prefixo="KG"
                  erro={errors.pesoReal?.message}
                  id="pesoReal"
                  type="text"
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("pesoReal");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>

          {/* Input valor Nfe */}
          <div className="flex flex-col lg:col-span-4">
            <Label obrigatorio={true} htmlFor="valorNfe">
              Valor total NF-e
            </Label>

            <Controller
              name="valorNfe"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  ref={field.ref}
                  erro={errors.valorNfe?.message}
                  className="w-full"
                  prefixo="R$"
                  id="valorNfe"
                  type="text"
                  value={field.value}
                  onAccept={(valor) => {
                    clearErrors("valorNfe");
                    field.onChange(valor);
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="font-medium">Dimensões das embalagens</p>
            <p className="text-gray-500 text-sm">Medidas em metros (m)</p>
          </div>

          <div>
            <LinhasCubagens />
          </div>
        </div>
      </div>
    </div>
  );
}
