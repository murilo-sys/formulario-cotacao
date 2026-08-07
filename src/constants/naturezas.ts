//Naturezas mercadoria mapeada para FRONT-END
export const OPCOES_NATUREZA = [
  { value: "perecivel", label: "Perecível" },
  { value: "cosmetico_geral", label: "Cosméticos em geral" },
  { value: "material_eletrico", label: "Equipamentos elétricos e eletrônicos" },
  { value: "alimenticio_geral", label: "Alimentos em geral" },
  { value: "saude_correlato", label: "Produtos de saúde / correlatos" },
  { value: "confeccoes_tecidos", label: "Confecções e tecidos" },
  { value: "autopecas", label: "Autopeças" },
  { value: "pecas_automotivas", label: "Peças automotivas" },
  { value: "brindes", label: "Brindes" },
  { value: "bijuterias", label: "Bijuterias" },
  { value: "livros", label: "Livros" },
  { value: "equip_protecao_epi", label: "Equipamentos de Proteção (EPI)" },
  { value: "propaganda_visual", label: "Material de propaganda e visual" },
  { value: "informatica", label: "Material de informática" },
  { value: "pecas_geral", label: "Peças em geral" },
  { value: "liquido", label: "Liquído" },
  { value: "quimica_diversos", label: "Prod. Quimicos Diversos" },
  { value: "artigos_perigosos", label: "Artigos Perigosos" }
] as const; //Usado as const para se tornar imutavel

export const NATUREZAS_BLOQUEADAS = ["liquido", "quimica_diversos", "artigos_perigosos", "perecivel"] as const; //Usado as const para se tornar imutavel

//Naturezas mercadoria mapeada para ESL
export const MAPA_NATUREZAS_ESL: Record<string, number> = {
  perecivel: 33858,
  cosmetico_geral: 17602,
  material_eletrico: 21059,
  alimenticio_geral: 15582,
  saude_correlato: 551,
  produto_saude: 551,
  confeccoes_tecidos: 15566,
  autopecas: 15563,
  pecas_automotivas: 19423,
  brindes: 33531,
  bijuterias: 19424,
  livros: 15594,
  equip_protecao_epi: 33528,
  propaganda_visual: 33748,
  eletroeletronicos: 21059,
  informatica: 15581,
  pecas_geral: 16989
} as const; //Usado as const para se tornar imutavel
