# Mapa AVD & Dor

🔗 **Acesse:** https://julianakrmem.github.io/mapa-avd-dor/

Ferramenta web **educativa** que ajuda pessoas com dor a adaptar as atividades de vida diária (AVDs). A pessoa escolhe uma tarefa, marca o que mais pesa nela e recebe sugestões práticas baseadas em princípios da Terapia Ocupacional e do manejo não farmacológico da dor.

> ⚠️ Ferramenta educativa. Não substitui avaliação, diagnóstico ou tratamento por profissional de saúde.

## Como funciona

1. **Atividade:** escolha uma AVD da lista (tomar banho, vestir-se, cozinhar, limpar a casa, computador, carregar compras…) ou digite uma atividade sua.
2. **O que pesa:** marque as demandas da tarefa (ficar em pé, movimentos repetitivos, carregar peso, fadiga, abaixar…). As demandas típicas já vêm marcadas.
3. **Sugestões em 3 pilares:**
   - **Conservação de energia:** fracionar a tarefa, pausar antes do pico da dor (*pacing*), priorizar o essencial.
   - **Adaptação da tarefa e do ambiente:** postura, altura dos objetos, utensílios e dispositivos de apoio.
   - **Atenção clínica:** orientação educativa sobre quando procurar a equipe de saúde.
4. **Plano do dia:** junte várias atividades e **copie** ou **imprima/salve em PDF** para levar à consulta ou usar numa discussão de caso. O plano fica salvo no navegador.

Também tem: layout responsivo (plano fixo na lateral no computador, barra de atalho no celular), modo escuro automático, versão de impressão limpa e navegação por teclado.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript, sem banco de dados nem backend. O build gera um site estático (`output: "export"`).

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera o site estático em out/
```

## Publicando

**GitHub Pages (automático):** o workflow `.github/workflows/deploy.yml` faz o build e publica a cada push na `main`.
1. Crie o repositório `mapa-avd-dor` e envie os arquivos.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. O site fica em `https://SEU-USUARIO.github.io/mapa-avd-dor/`.

**Vercel:** importe o repositório em vercel.com. Funciona sem configuração extra.

## Estrutura

```
mapa-avd-dor/
├── app/
│   ├── layout.tsx         # HTML base e metadados
│   ├── icon.svg           # favicon
│   ├── page.tsx           # página (cabeçalho, rodapé)
│   └── globals.css        # estilos (inclui versão para impressão)
├── components/
│   ├── MapaAvd.tsx        # interface: etapas 1–3, sugestões, impressão (client component)
│   ├── PlanoDoDia.tsx     # painel do plano do dia
│   └── Icone.tsx          # ícones SVG (sem dependências)
├── lib/
│   └── sugestoes.ts       # motor de sugestões e texto do plano (funções puras)
├── data/
│   └── dados.ts           # TODO o conteúdo + tipos (atividades, demandas, dicas, alertas)
├── .github/workflows/deploy.yml
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Esquema de dados (`data/dados.ts`)

| Bloco | O que guarda |
|---|---|
| `pilares` | Título e descrição dos 3 pilares (`energia`, `adaptacao`, `atencao`). |
| `demandas[]` | `id`, `rotulo` e `dicas` por pilar. São as tags físicas da tarefa. |
| `atividades[]` | `id`, `nome`, `categoria`, `demandas` (ids pré-marcados) e `dicas` específicas por pilar. |
| `atencaoClinica` | Mensagens gerais, sinais de alerta e o aviso educativo. |

**Motor de sugestões:** junta as dicas específicas da atividade com as dicas de cada demanda marcada e remove as repetidas.

### Adicionando uma atividade

```js
{
  id: "jardinagem",
  nome: "Cuidar do jardim",
  categoria: "Lazer",
  demandas: ["abaixar_agachar", "forca_preensao"],
  dicas: {
    energia: ["Regue em dias alternados, uma parte do jardim por vez."],
    adaptacao: ["Use vasos elevados ou canteiros na altura da cintura."]
  }
}
```

## Fundamentação

O conteúdo se apoia em princípios de conservação de energia, *pacing*, simplificação da tarefa e adaptação ambiental usados na Terapia Ocupacional. Referências de partida (confira e complete antes de publicar):

- American Occupational Therapy Association. *Occupational Therapy Practice Framework: Domain and Process* (4th ed.). Am J Occup Ther. 2020;74(Suppl 2).
- Andrews NE, Strong J, Meredith PJ. Activity pacing, avoidance, endurance, and associations with patient functioning in chronic pain: a systematic review and meta-analysis. Arch Phys Med Rehabil. 2012;93(11):2109-2121.

Projeto relacionado: cartilha *Cuidar da dor, cuidar da vida*.

## Próximos passos

- [ ] Revisar o conteúdo com orientador(a) da TO/ortopedia
- [ ] Vincular cada dica a uma referência (campo `ref` no `dados.ts`)
- [ ] Mais atividades (dirigir, dormir, transporte público, higiene oral)
- [ ] Modo de alto contraste e fonte ampliada
- [ ] Testes de usabilidade com pacientes/estudantes

## Autoria

Juliana Carmem Costa, estudante de Medicina (FAG) e de Terapia Ocupacional (UniFatecie).
ORCID: [0009-0007-8636-3695](https://orcid.org/0009-0007-8636-3695)

Licença MIT.
