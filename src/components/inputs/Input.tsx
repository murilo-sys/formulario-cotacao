import { IMaskInput } from "react-imask";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    prefixo?: string
    erro?: string
    mask?: string
    onAccept?: (value: string) => void;
}

export function Input({ className, mask, onAccept, erro, prefixo, ...props }: InputProps) {

    const baseClasses = `w-full border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`

    if (mask && onAccept) {
        return (
            <div className={`relative w-full ${erro ? "bg-red-100 animate-shake" : ""}`}>
                {/*@ts-expect-error: Ignorando a tipagem complexa da biblioteca react-imask */}
                <IMaskInput
                    {...(props)}
                    mask={mask}
                    onAccept={onAccept}
                    className={baseClasses}
                />

                {prefixo ? (<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    {prefixo + " |"}
                </span>) : ""}
            </div>
        )
    }

    return (

        <div className={`relative w-full ${erro ? "bg-red-100 animate-shake" : ""}`}>
            <input
                {...props}
                className={`w-full ${baseClasses}`}
            />

            {prefixo ? (<span className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`}>
                {prefixo + " |"}
            </span>) : ""}
        </div>

    )
}