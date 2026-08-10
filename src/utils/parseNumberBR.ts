export default function parseNumberBR(valor: string) {
  if (!valor) return 0;

  return Number(valor.replace(/\./g, "").replace(",", "."));
}
