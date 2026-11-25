"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DADOS, type PilarId } from "@/data/dados";
import { gerarSugestoes, rotuloDemanda, textoDoPlano, type ItemPlano } from "@/lib/sugestoes";
import Icone from "./Icone";
import PlanoDoDia from "./PlanoDoDia";

const PERSONALIZADA = "personalizada";
const CHAVE_STORAGE = "mapa-avd-dor:plano";

const categorias = [...new Set(DADOS.atividades.map((a) => a.categoria))];
const corCategoria = (c: string) => `cat-${categorias.indexOf(c) % 5}`;

function Etapa({ numero, feita, titulo, children, id }: { numero: number; feita: boolean; titulo: ReactNode; children: ReactNode; id: string }) {
  return (
    <section className="cartao etapa" aria-labelledby={id}>
      <h2 id={id}>
        <span className={`num ${feita ? "num-feita" : ""}`} aria-hidden="true">
          {feita ? <Icone nome="check" tamanho={15} strokeWidth={3} /> : numero}
        </span>
        <span>{titulo}</span>
      </h2>
      {children}
    </section>
  );
}

const LIMITE_INICIAL = 5;

function CartaoPilar({ id, itens, children, limite }: { id: PilarId; itens: string[]; children?: ReactNode; limite?: number }) {
  const p = DADOS.pilares[id];
  const [expandido, setExpandido] = useState(false);
  const corta = limite !== undefined && itens.length > limite && !expandido;
  const visiveis = corta ? itens.slice(0, limite) : itens;
  return (
    <article className={`pilar pilar-${id}`}>
      <header>
        <span className="pilar-icone"><Icone nome={id} tamanho={18} /></span>
        <div>
          <h3>{p.titulo}</h3>
          <p>{p.descricao}</p>
        </div>
      </header>
      {visiveis.length > 0 && <ul>{visiveis.map((t) => <li key={t}>{t}</li>)}</ul>}
      {limite !== undefined && itens.length > limite && (
        <button type="button" className="ver-mais" aria-expanded={expandido} onClick={() => setExpandido((v) => !v)}>
          {expandido ? "Ver menos" : `Ver mais ${itens.length - limite}`}
          <Icone nome="seta" tamanho={14} className={expandido ? "girado" : ""} />
        </button>
      )}
      {children}
    </article>
  );
}

export default function MapaAvd() {
  const [atividadeId, setAtividadeId] = useState<string | null>(null);
  const [nomePersonalizado, setNomePersonalizado] = useState("");
  const [demandas, setDemandas] = useState<Set<string>>(new Set());
  const [plano, setPlano] = useState<ItemPlano[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [aviso, setAviso] = useState("");
  const resultadoRef = useRef<HTMLDivElement>(null);
  const timerAviso = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Plano salvo no navegador (por pessoa, neste aparelho)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) setPlano(JSON.parse(salvo));
    } catch { /* armazenamento indisponível: segue sem salvar */ }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try { localStorage.setItem(CHAVE_STORAGE, JSON.stringify(plano)); } catch { /* ignora */ }
  }, [plano, carregado]);

  useEffect(() => () => { if (timerAviso.current) clearTimeout(timerAviso.current); }, []);

  const nomeAtual =
    atividadeId === PERSONALIZADA
      ? nomePersonalizado.trim()
      : DADOS.atividades.find((a) => a.id === atividadeId)?.nome ?? "";

  const sugestoes = useMemo(() => gerarSugestoes(atividadeId, demandas), [atividadeId, demandas]);
  const semSugestoes = !sugestoes.energia.length && !sugestoes.adaptacao.length;
  const jaNoPlano = plano.some((i) => i.nome === nomeAtual);

  function mostrarAviso(texto: string) {
    setAviso(texto);
    if (timerAviso.current) clearTimeout(timerAviso.current);
    timerAviso.current = setTimeout(() => setAviso(""), 2800);
  }

  function selecionarAtividade(id: string) {
    const a = DADOS.atividades.find((x) => x.id === id);
    if (!a) return;
    setAtividadeId(id);
    setNomePersonalizado("");
    setDemandas(new Set(a.demandas));
  }

  function digitarPersonalizada(texto: string) {
    setNomePersonalizado(texto);
    if (texto.trim()) {
      if (atividadeId !== PERSONALIZADA) setDemandas(new Set());
      setAtividadeId(PERSONALIZADA);
    } else if (atividadeId === PERSONALIZADA) {
      setAtividadeId(null);
    }
  }

  function alternarDemanda(id: string) {
    setDemandas((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function recomecar() {
    setAtividadeId(null);
    setNomePersonalizado("");
    setDemandas(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function adicionarAoPlano() {
    if (!nomeAtual || semSugestoes) return;
    const item: ItemPlano = { nome: nomeAtual, demandas: [...demandas].map(rotuloDemanda), sugestoes };
    setPlano((p) => {
      const i = p.findIndex((x) => x.nome === nomeAtual);
      if (i === -1) return [...p, item];
      const novo = [...p];
      novo[i] = item;
      return novo;
    });
    mostrarAviso(jaNoPlano ? `“${nomeAtual}” atualizado no plano` : `“${nomeAtual}” adicionado ao plano`);
  }

  async function copiarPlano() {
    const texto = textoDoPlano(plano);
    try {
      await navigator.clipboard.writeText(texto);
      mostrarAviso("Plano copiado. Cole onde quiser.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      mostrarAviso(ok ? "Plano copiado. Cole onde quiser." : "Não deu para copiar. Use Imprimir ou salvar PDF.");
    }
  }

  function limparPlano() {
    if (plano.length && !window.confirm("Remover todas as atividades do plano?")) return;
    setPlano([]);
  }

  return (
    <>
      <div className="layout">
        <div className="coluna-principal">
          <Etapa numero={1} feita={Boolean(nomeAtual)} titulo="Qual atividade está difícil?" id="t-etapa1">
            <div className="grade-atividades" role="radiogroup" aria-labelledby="t-etapa1">
              {DADOS.atividades.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={atividadeId === a.id}
                  className="opcao-atividade"
                  onClick={() => selecionarAtividade(a.id)}
                >
                  <span className="opcao-nome">{a.nome}</span>
                  <span className={`tag ${corCategoria(a.categoria)}`}>{a.categoria}</span>
                  {atividadeId === a.id && <Icone nome="check" tamanho={16} strokeWidth={3} className="opcao-check" />}
                </button>
              ))}
            </div>
            <label className="campo-personalizado">
              <span>Não está na lista? Escreva a sua:</span>
              <input
                type="text"
                placeholder="Regar as plantas"
                maxLength={60}
                value={nomePersonalizado}
                onChange={(e) => digitarPersonalizada(e.target.value)}
              />
            </label>
          </Etapa>

          <Etapa numero={2} feita={demandas.size > 0} titulo="O que mais pesa nessa tarefa?" id="t-etapa2">
            <p className="dica-etapa">
              {atividadeId && atividadeId !== PERSONALIZADA
                ? "Já marcamos o que costuma pesar nessa atividade. Ajuste para o seu caso."
                : "Marque uma ou mais opções."}
            </p>
            <div className="chips" role="group" aria-labelledby="t-etapa2">
              {DADOS.demandas.map((d) => {
                const ativo = demandas.has(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className="chip"
                    aria-pressed={ativo}
                    onClick={() => alternarDemanda(d.id)}
                  >
                    {ativo ? <Icone nome="check" tamanho={14} strokeWidth={3} /> : <Icone nome="mais" tamanho={14} />}
                    {d.rotulo}
                  </button>
                );
              })}
            </div>
          </Etapa>

          <div ref={resultadoRef} aria-live="polite">
            {nomeAtual ? (
              <Etapa numero={3} feita={jaNoPlano} titulo={<>Sugestões para <em>{nomeAtual}</em></>} id="t-etapa3">
                {semSugestoes ? (
                  <p className="dica-etapa">Marque na etapa 2 o que mais pesa nessa tarefa para ver as sugestões.</p>
                ) : (
                  <div className="pilares">
                    <CartaoPilar key={`e-${nomeAtual}`} id="energia" itens={sugestoes.energia} limite={LIMITE_INICIAL} />
                    <CartaoPilar key={`a-${nomeAtual}`} id="adaptacao" itens={sugestoes.adaptacao} limite={LIMITE_INICIAL} />
                  </div>
                )}

                <CartaoPilar id="atencao" itens={DADOS.atencaoClinica.geral}>
                  <div className="alertas">
                    <p className="alertas-titulo"><Icone nome="alerta" tamanho={16} /> Procure a equipe de saúde se notar:</p>
                    <ul>{DADOS.atencaoClinica.sinaisDeAlerta.map((s) => <li key={s}>{s}</li>)}</ul>
                  </div>
                </CartaoPilar>

                <div className="resultado-acoes">
                  <button type="button" className="btn btn-primario" onClick={adicionarAoPlano} disabled={semSugestoes}>
                    <Icone nome={jaNoPlano ? "recomecar" : "mais"} />
                    {jaNoPlano ? "Atualizar no plano" : "Adicionar ao plano"}
                  </button>
                  <button type="button" className="btn btn-fantasma" onClick={recomecar}>
                    Escolher outra atividade
                  </button>
                </div>
              </Etapa>
            ) : (
              <div className="placeholder-resultado">
                <span className="num" aria-hidden="true">3</span>
                <p>As sugestões aparecem aqui quando você escolher uma atividade.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="coluna-plano">
          <PlanoDoDia
            plano={plano}
            onRemover={(nome) => setPlano((p) => p.filter((i) => i.nome !== nome))}
            onLimpar={limparPlano}
            onCopiar={copiarPlano}
          />
        </aside>
      </div>

      {plano.length > 0 && (
        <a href="#plano" className="barra-plano-mobile">
          <Icone nome="plano" /> Ver meu plano <span className="contador">{plano.length}</span>
        </a>
      )}

      <div className={`toast ${aviso ? "toast-visivel" : ""}`} role="status" aria-live="polite">
        {aviso && <><Icone nome="check" tamanho={16} strokeWidth={3} /> {aviso}</>}
      </div>

      {/* Versão de impressão do plano */}
      <div className="so-impressao" aria-hidden="true">
        <h1>Meu plano do dia</h1>
        <p className="imp-data">{carregado ? new Date().toLocaleDateString("pt-BR") : ""}</p>
        {plano.map((item, i) => (
          <section key={item.nome}>
            <h2>{i + 1}. {item.nome}</h2>
            {item.demandas.length > 0 && <p><strong>O que pesa:</strong> {item.demandas.join(", ")}</p>}
            {(["energia", "adaptacao"] as const).map((p) =>
              item.sugestoes[p].length ? (
                <div key={p}>
                  <h3>{DADOS.pilares[p].titulo}</h3>
                  <ul>{item.sugestoes[p].map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              ) : null
            )}
          </section>
        ))}
        <section>
          <h2>{DADOS.pilares.atencao.titulo}: procure a equipe de saúde se notar</h2>
          <ul>{DADOS.atencaoClinica.sinaisDeAlerta.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
        <p className="imp-aviso">{DADOS.atencaoClinica.aviso}</p>
      </div>
    </>
  );
}
