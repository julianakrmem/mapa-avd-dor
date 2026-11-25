import MapaAvd from "@/components/MapaAvd";
import { DADOS } from "@/data/dados";

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="pular-link">Pular para o conteúdo</a>

      <header className="topo">
        <div className="container topo-inner">
          <div className="marca">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect width="40" height="40" rx="12" fill="var(--primaria)" />
              <path d="M11 22c3-6 6-9 9-9s6 3 9 9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
              <circle cx="20" cy="27" r="2.6" fill="#fff" />
            </svg>
            <div>
              <h1>Mapa AVD &amp; Dor</h1>
              <p className="selo">Terapia Ocupacional · manejo não farmacológico da dor</p>
            </div>
          </div>
          <p className="subtitulo">
            Escolha uma atividade do dia a dia, marque o que mais pesa nela e receba sugestões práticas para fazer com menos dor.
          </p>
        </div>
      </header>

      <main id="conteudo" className="container">
        <MapaAvd />
      </main>

      <footer className="rodape">
        <div className="container rodape-inner">
          <p className="rodape-aviso">{DADOS.atencaoClinica.aviso}</p>
          <p>
            Projeto acadêmico de Juliana Carmem Costa ·{" "}
            <a href="https://github.com/julianakrmem/mapa-avd-dor">código no GitHub</a> · v{DADOS.versao}
          </p>
        </div>
      </footer>
    </>
  );
}
