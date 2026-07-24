"use client"

import { motion } from "framer-motion"

export default function FormularioCotacaoCompleto() {

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            exit={{ opacity: 0, height: 0 }}

            className="bg-white rounded-xl p-3"
        >
            <span>Outro formulario</span>
        </motion.div>
    )

}