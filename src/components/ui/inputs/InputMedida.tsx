"use client";

interface InputMedidasProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  prefixo?: string;
  onChange?: (value: string) => void; // 👈 Agora o TS sabe que enviamos uma string ("0,01")!
  erro?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function InputMedida({ className, erro, prefixo, onChange, ...props }: InputMedidasProps) {
  const baseClasses = `transitio-all duration-300 w-full border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const apenasNumero = e.target.value.replace(/\D/g, "");
    const valorAntesVirgula = Number(apenasNumero) / 100;

    const valorFormatado = valorAntesVirgula.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });

    onChange(String(valorFormatado));
  };

  return (
    <div className={`relative w-full ${erro ? "bg-red-100 animate-shake" : ""}`}>
      <input {...props} className={`${className} ${baseClasses ? baseClasses : ""}`} onChange={handleChange} />

      {prefixo ? <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`}>{prefixo + " |"}</span> : ""}
    </div>
  );
}
