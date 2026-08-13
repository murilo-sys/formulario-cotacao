"use client";

import { CotacaoDados } from "@/schemas/cotacaoSchema";
import { Controller, Control, FieldPath } from "react-hook-form";

interface ToggleSwitchProps {
  name: FieldPath<CotacaoDados>;
  control: Control<CotacaoDados>;
  label?: string;
}

export function ToggleSwitch({ name, control, label }: ToggleSwitchProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex flex-col items-center cursor-pointer select-none">
          {/* Texto ao lado (Opcional) */}
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

          {/* Input invisível para o formulário continuar lendo o boolean */}
          <input
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
            className="sr-only" // Esconde o checkbox quadrado padrão
          />

          {/*Fundo*/}
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${field.value ? "bg-blue-600" : "bg-gray-300"}`}>
            {/* Bolinha branca que desliza pro lado */}
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out
  ${field.value ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </label>
      )}
    />
  );
}
