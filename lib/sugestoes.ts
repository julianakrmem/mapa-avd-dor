import { DADOS, type PilarSugestao } from "@/data/dados";

export type Sugestoes = Record<PilarSugestao, string[]>;

export interface ItemPlano {
  nome: string;
  demandas: string[]; // rótulos
  sugestoes: Sugestoes;
}

const mapaDemandas = Object.fromEntries(DADOS.demandas.map((d) => [d.id, d]));
const PILARES: PilarSugestao[] = ["energia", "adaptacao"];

export function rotuloDemanda(id: string): string {
  return mapaDemandas[id]?.rotulo ?? id;
}

/** Junta dicas específicas da atividade + dicas de cada demanda marcada, sem repetir. */
export function gerarSugestoes(atividadeId: string | null, demandas: Iterable<string>): Sugestoes {
  const sug: Sugestoes = { energia: [], adaptacao: [] };
  const atividade = DADOS.atividades.find((a) => a.id === atividadeId);

  for (const p of PILARES) {
    if (atividade) sug[p].push(...(atividade.dicas[p] ?? []));
    for (const id of demandas) sug[p].push(...(mapaDemandas[id]?.dicas[p] ?? []));
    sug[p] = [...new Set(sug[p])];
  }
  return sug;
}

/** Texto do plano do dia, pronto para copiar. */
export function textoDoPlano(plano: ItemPlano[]): string {
  const P = DADOS.pilares;
  const linhas = [`MEU PLANO DO DIA — ${new Date().toLocaleDateString("pt-BR")}`, ""];

  plano.forEach((item, i) => {
    linhas.push(`${i + 1}. ${item.nome.toUpperCase()}`);
    if (item.demandas.length) linhas.push(`   O que pesa: ${item.demandas.join(", ")}`);
    for (const p of PILARES) {
      if (!item.sugestoes[p].length) continue;
      linhas.push(`   ${P[p].titulo}:`);
      item.sugestoes[p].forEach((s) => linhas.push(`   - ${s}`));
    }
    linhas.push("");
  });

  linhas.push(`${P.atencao.titulo} — procure a equipe de saúde se notar:`);
  DADOS.atencaoClinica.sinaisDeAlerta.forEach((s) => linhas.push(`- ${s}`));
  linhas.push("", DADOS.atencaoClinica.aviso);
  return linhas.join("\n");
}
