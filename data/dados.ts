/**
 * Mapa AVD & Dor — base de dados
 * Arquivo único com todo o conteúdo da ferramenta. Para incluir atividades,
 * demandas ou dicas, edite apenas este arquivo.
 */

export type PilarSugestao = "energia" | "adaptacao";
export type PilarId = PilarSugestao | "atencao";
export type Dicas = Partial<Record<PilarSugestao, string[]>>;

export interface Demanda {
  id: string;
  rotulo: string;
  dicas: Dicas;
}

export interface Atividade {
  id: string;
  nome: string;
  categoria: string;
  /** ids de `demandas` que já vêm marcados */
  demandas: string[];
  dicas: Dicas;
}

export interface Dados {
  versao: string;
  pilares: Record<PilarId, { titulo: string; descricao: string }>;
  demandas: Demanda[];
  atividades: Atividade[];
  atencaoClinica: { geral: string[]; sinaisDeAlerta: string[]; aviso: string };
}

export const DADOS: Dados = {
  versao: "0.1.0",

  pilares: {
    energia: {
      titulo: "Conservação de energia",
      descricao: "Fracionar, pausar antes do pico da dor e priorizar o essencial."
    },
    adaptacao: {
      titulo: "Adaptação da tarefa e do ambiente",
      descricao: "Mudar a forma de fazer, a postura, os objetos e o espaço."
    },
    atencao: {
      titulo: "Atenção clínica",
      descricao: "Quando vale conversar com a equipe de saúde."
    }
  },

  demandas: [
    {
      id: "em_pe_prolongado",
      rotulo: "Ficar muito tempo em pé",
      dicas: {
        energia: [
          "Divida a tarefa em blocos curtos e alterne com momentos sentado(a).",
          "Faça a pausa antes de a dor aumentar, não só quando ela já estiver forte."
        ],
        adaptacao: [
          "Use um banco ou cadeira alta para fazer parte da tarefa sentado(a).",
          "Apoie um dos pés num degrau baixo e vá alternando o pé."
        ]
      }
    },
    {
      id: "sentado_prolongado",
      rotulo: "Ficar muito tempo sentado(a)",
      dicas: {
        energia: [
          "Programe um lembrete para levantar e se movimentar a cada 30–50 minutos."
        ],
        adaptacao: [
          "Ajuste a cadeira para os pés apoiados no chão e os joelhos na altura do quadril.",
          "Use apoio para a lombar (almofada ou toalha enrolada)."
        ]
      }
    },
    {
      id: "movimentos_repetitivos",
      rotulo: "Movimentos repetitivos",
      dicas: {
        energia: [
          "Intercale a tarefa repetitiva com outra que use movimentos diferentes.",
          "Faça micropausas para soltar mãos, punhos e ombros."
        ],
        adaptacao: [
          "Prefira utensílios com cabo mais grosso ou emborrachado.",
          "Use ferramentas elétricas ou automáticas quando possível (processador, abridor)."
        ]
      }
    },
    {
      id: "carregar_peso",
      rotulo: "Carregar peso",
      dicas: {
        energia: [
          "Divida a carga em várias viagens mais leves.",
          "Deixe tarefas pesadas para o horário do dia em que você tem mais disposição."
        ],
        adaptacao: [
          "Use carrinho, mochila nas duas alças ou sacolas divididas entre as duas mãos.",
          "Leve a carga próxima ao corpo e dobre os joelhos para pegar do chão."
        ]
      }
    },
    {
      id: "fadiga_rapida",
      rotulo: "Cansaço / fadiga rápida",
      dicas: {
        energia: [
          "Liste as tarefas do dia e marque só as essenciais; o resto pode esperar ou ser dividido.",
          "Distribua as tarefas mais pesadas ao longo da semana, não todas no mesmo dia.",
          "Mantenha um ritmo constante (pacing) em vez de fazer tudo num dia bom e travar no seguinte."
        ],
        adaptacao: [
          "Peça ou divida ajuda com alguém da casa nas partes mais cansativas."
        ]
      }
    },
    {
      id: "abaixar_agachar",
      rotulo: "Dor ao abaixar / agachar",
      dicas: {
        energia: [
          "Agrupe tudo o que precisa ser feito embaixo num único momento."
        ],
        adaptacao: [
          "Reorganize os objetos de uso frequente entre a altura da cintura e dos ombros.",
          "Use pegador de objetos, pá de cabo longo ou um banquinho baixo."
        ]
      }
    },
    {
      id: "bracos_elevados",
      rotulo: "Braços acima da cabeça",
      dicas: {
        energia: [
          "Faça pausas curtas baixando os braços e relaxando os ombros."
        ],
        adaptacao: [
          "Traga os objetos das prateleiras altas para uma altura mais baixa.",
          "Use escadinha estável para ficar mais perto do que precisa alcançar."
        ]
      }
    },
    {
      id: "forca_preensao",
      rotulo: "Força nas mãos (segurar, torcer, abrir)",
      dicas: {
        energia: [
          "Alterne as mãos e evite manter a pegada apertada por muito tempo."
        ],
        adaptacao: [
          "Use abridores de pote, tapetes antiderrapantes e engrossadores de cabo.",
          "Prefira torneiras e maçanetas de alavanca quando possível."
        ]
      }
    }
  ],

  atividades: [
    {
      id: "banho",
      nome: "Tomar banho",
      categoria: "Autocuidado",
      demandas: ["em_pe_prolongado", "abaixar_agachar", "bracos_elevados"],
      dicas: {
        energia: ["Deixe tudo separado antes de entrar no banho para evitar idas e vindas."],
        adaptacao: [
          "Use cadeira ou banco de banho para se lavar sentado(a).",
          "Esponja de cabo longo ajuda a alcançar pés e costas sem se curvar.",
          "Tapete antiderrapante e barra de apoio aumentam a segurança."
        ]
      }
    },
    {
      id: "vestir",
      nome: "Vestir-se",
      categoria: "Autocuidado",
      demandas: ["abaixar_agachar", "bracos_elevados"],
      dicas: {
        energia: ["Separe a roupa na noite anterior."],
        adaptacao: [
          "Vista-se sentado(a), começando pelo lado mais dolorido.",
          "Calçadeira de cabo longo e calçados sem cadarço facilitam.",
          "Prefira roupas mais largas e com fechos simples."
        ]
      }
    },
    {
      id: "cozinhar",
      nome: "Cozinhar",
      categoria: "Tarefas domésticas",
      demandas: ["em_pe_prolongado", "movimentos_repetitivos", "forca_preensao"],
      dicas: {
        energia: [
          "Pique os ingredientes sentado(a) à mesa.",
          "Cozinhe em maior quantidade e congele porções para os dias difíceis."
        ],
        adaptacao: [
          "Use panelas mais leves e deslize-as no fogão em vez de levantar.",
          "Deixe os utensílios mais usados ao alcance, na bancada."
        ]
      }
    },
    {
      id: "limpar_casa",
      nome: "Limpar a casa",
      categoria: "Tarefas domésticas",
      demandas: ["abaixar_agachar", "movimentos_repetitivos", "fadiga_rapida"],
      dicas: {
        energia: [
          "Limpe um cômodo por dia em vez da casa toda de uma vez.",
          "Alterne tarefas leves (tirar pó) com pesadas (passar pano)."
        ],
        adaptacao: [
          "Use rodo, mop e pá de cabo longo para não se curvar.",
          "Leve um balde com rodinhas ou um carrinho com os produtos."
        ]
      }
    },
    {
      id: "computador",
      nome: "Estudar / trabalhar no computador",
      categoria: "Trabalho e estudo",
      demandas: ["sentado_prolongado", "movimentos_repetitivos"],
      dicas: {
        energia: ["Use blocos de foco com pausa ativa (por exemplo, 45 min de foco e 5 min de movimento)."],
        adaptacao: [
          "Topo da tela na altura dos olhos; notebook sobre suporte com teclado externo.",
          "Antebraços apoiados e punhos retos ao digitar."
        ]
      }
    },
    {
      id: "compras",
      nome: "Carregar compras",
      categoria: "Vida na comunidade",
      demandas: ["carregar_peso", "em_pe_prolongado", "fadiga_rapida"],
      dicas: {
        energia: [
          "Faça compras menores e mais frequentes, ou use entrega em casa.",
          "Vá em horários mais vazios para ficar menos tempo em pé na fila."
        ],
        adaptacao: [
          "Use carrinho de feira ou carrinho do mercado até o carro.",
          "Guarde primeiro os itens gelados e deixe o resto para depois de uma pausa."
        ]
      }
    },
    {
      id: "roupa",
      nome: "Lavar e estender roupa",
      categoria: "Tarefas domésticas",
      demandas: ["bracos_elevados", "abaixar_agachar", "carregar_peso"],
      dicas: {
        energia: ["Divida em etapas: lavar, estender e recolher em momentos diferentes."],
        adaptacao: [
          "Varal de chão ou de altura regulável evita braços muito elevados.",
          "Apoie o cesto numa cadeira para não pegar a roupa do chão."
        ]
      }
    },
    {
      id: "cuidar_crianca",
      nome: "Cuidar de criança / pegar no colo",
      categoria: "Cuidado com outras pessoas",
      demandas: ["carregar_peso", "abaixar_agachar", "fadiga_rapida"],
      dicas: {
        energia: ["Sente-se para dar colo, alimentar ou brincar sempre que possível."],
        adaptacao: [
          "Use trocador na altura da cintura.",
          "Carregador ergonômico distribui melhor o peso do que segurar só nos braços."
        ]
      }
    }
  ],

  atencaoClinica: {
    geral: [
      "Se a dor está impedindo você de fazer atividades importantes do dia a dia, converse com a equipe de saúde.",
      "Leve este plano para a consulta: ele ajuda a mostrar quais tarefas estão mais difíceis.",
      "Um(a) terapeuta ocupacional ou fisioterapeuta pode avaliar e indicar adaptações sob medida."
    ],
    sinaisDeAlerta: [
      "Rigidez que dura muito tempo ao acordar ou não melhora com o movimento.",
      "Dor que piora progressivamente ao longo das semanas.",
      "Dor que acorda você à noite e não alivia com repouso.",
      "Formigamento, dormência ou perda de força que estão aumentando.",
      "Dor acompanhada de febre, inchaço/vermelhidão na articulação ou perda de peso sem explicação."
    ],
    aviso: "Ferramenta educativa. Não substitui avaliação, diagnóstico ou tratamento por profissional de saúde."
  }
};
