import { addBusinessDays, format } from "date-fns";
import { toZonedTime } from "date-fns-tz"

export function formatarData(dias: number) {

    console.log(dias);

    const dataHoje = toZonedTime(new Date(), "America/Sao_Paulo")

    console.log(dataHoje);

    const dataFinal = addBusinessDays(dataHoje, dias)

    console.log(format(dataFinal, "dd/MM/yyyy"));

    return format(dataFinal, "dd/MM/yyyy")
}