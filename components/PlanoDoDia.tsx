"use client";

import { DADOS } from "@/data/dados";
import type { ItemPlano } from "@/lib/sugestoes";
import Icone from "./Icone";

interface Props {
  plano: ItemPlano[];
  onRemover: (nome: string) => void;
  onLimpar: () => void;
  onCopiar: () => void;
}

export default function PlanoDoDia({ plano, onRemover, onLimpar, onCopiar }: Props) {
  const total = plano.length;

  return (
    <section className="cartao plano" id="plano" aria-labelledby="t-plano">
      <div className="plano-topo">
        <h2 id="t-plano">
          <Icone nome="plano" tamanho={20} />
          Meu plano do dia
        </h2>
        {total > 0 && <span className="contador">{total}</span>}
      </div>

      {total === 0 ? (
        <div className="vazio">
          <p className="vazio-titulo">Monte seu plano aqui</p>
          <p>Escolha uma atividade, veja as sugestões e toque em <strong>Adicionar ao plano</strong>. Você pode juntar várias atividades e levar o resumo para a consulta.</p>
        </div>
      ) : (
        <>
          <ul className="lista-plano">
            {plano.map((item) => {
              const n = item.sugestoes.energia.length + item.sugestoes.adaptacao.length;
              return (
                <li key={item.nome}>
                  <details>
                    <summary>
                      <span className="item-nome">{item.nome}</span>
                      <span className="item-meta">{n} {n === 1 ? "sugestão" : "sugestões"}</span>
                      <Icone nome="seta" tamanho={16} className="item-seta" />
                    </summary>
                    <div className="item-corpo">
                      {item.demandas.length > 0 && (
                        <p className="item-demandas">O que pesa: {item.demandas.join(", ")}</p>
                      )}
                      {(["energia", "adaptacao"] as const).map((p) =>
                        item.sugestoes[p].length ? (
                          <div key={p} className={`item-pilar item-pilar-${p}`}>
                            <p>{DADOS.pilares[p].titulo}</p>
                            <ul>{item.sugestoes[p].map((s) => <li key={s}>{s}</li>)}</ul>
                          </div>
                        ) : null
                      )}
                    </div>
                  </details>
                  <button
                    type="button"
                    className="btn-icone"
                    aria-label={`Remover ${item.nome} do plano`}
                    title="Remover"
                    onClick={() => onRemover(item.nome)}
                  >
                    <Icone nome="fechar" tamanho={16} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="plano-acoes">
            <button type="button" className="btn btn-primario" onClick={onCopiar}>
              <Icone nome="copiar" /> Copiar meu plano
            </button>
            <button type="button" className="btn" onClick={() => window.print()}>
              <Icone nome="imprimir" /> Imprimir ou salvar PDF
            </button>
            <button type="button" className="btn btn-fantasma" onClick={onLimpar}>
              <Icone nome="lixeira" /> Limpar plano
            </button>
          </div>
        </>
      )}
    </section>
  );
}
