"use client"

import { motion } from "framer-motion"
import { IMaskInput } from "react-imask";
import Image from "next/image";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    prefixo?: string
    erro?: string
    rua?: string
    mask?: string
    onAccept?: (value: string) => void;
}

export function Input({ className, mask, onAccept, erro, prefixo, rua, ...props }: InputProps) {

    const baseClasses = `w-full border border-zinc-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`

    return (
        <div className="flex flex-col w-full gap-1">

            <div className={`relative w-full ${erro ? "bg-red-100 animate-shake" : ""}`}>

                {mask && onAccept ? <>
                    {/*@ts-expect-error: Ignorando a tipagem complexa da biblioteca react-imask */}
                    <IMaskInput
                        {...(props)}
                        mask={mask}
                        unmask={true}
                        onAccept={onAccept}
                        className={baseClasses}
                    />
                </> :
                    <input
                        {...props}
                        className={`w-full ${baseClasses}`}
                    />
                }

                {prefixo && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        {prefixo + " |"}
                    </span>)}
            </div>


            {!prefixo && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        height: rua ? "auto" : 0,
                        opacity: rua ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-row border border-blue-200 bg-blue-50 w-fit rounded-xl px-2 gap-1">
                    <Image
                        src={"/address.svg"}
                        alt="Icone de localização"
                        width={18}
                        height={18}
                    />

                    <span className={"text-sm"}>
                        {rua}
                    </span>
                </motion.div>
            )}

        </div>
    )
}