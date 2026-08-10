import axios from "axios";

export default function consultarDoc(doc: string): boolean {
  if (!doc) return false;

  const ehCpf: boolean = doc.length === 14 ? false : true;

  if (ehCpf) {
  }

  return false;
}
