// Constantes do jogo em um único lugar. Mexa aqui, não no meio da lógica.

const FAMILIA = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const MARCADOR = "'Bebas Neue', 'Arial Narrow', sans-serif";

export const CONFIG = {
  LARGURA: 1280,
  ALTURA: 720,

  DEBUG: false,

  // Caixa de diálogo ajustada para deixar espaço limpo para a barra inferior discreta
  CAIXA: { x: 60, y: 455, largura: 1160, altura: 210 },
  ALTURA_LINHA: 30,
  CARACTERES_POR_SEGUNDO: 42,

  // Botões da tela de escolha
  BOTAO: { largura: 1000, altura: 80, espaco: 18 },

  // Sprites
  SPRITE: { largura: 300, altura: 480, base: 510 },
  POSICOES: {
    esquerda: { x: 280, escala: 1 },
    centro: { x: 640, escala: 1 },
    direita: { x: 1000, escala: 1 },
    fundo: { x: 960, escala: 0.6 },
  },

  FONTES: {
    texto: `23px ${FAMILIA}`,
    pensamento: `italic 23px ${FAMILIA}`,
    nome: `bold 26px ${FAMILIA}`,
    acao: `italic 19px ${FAMILIA}`,
    botao: `23px ${FAMILIA}`,
    titulo: `104px ${MARCADOR}`,
    titulo2: `52px ${MARCADOR}`,
    titulo3: `22px ${MARCADOR}`,
    menu: `700 24px ${FAMILIA}`,
    pequena: `17px ${FAMILIA}`,
    micro: `bold 14px ${FAMILIA}`,
    debug: "14px monospace",
  },

  TECLAS_AVANCAR: ["Space", "Enter", "ArrowRight"],

  VOLUME: { musica: 0.4, sfx: 0.8 },

  COR: {
    lousa: "#13241b",
    giz: "#f1efe6",
    verde: "#2f9e41",
    vermelho: "#d9342b",
    amarelo: "#e8a23c",
    azul: "#4dabf7",
    fundo: "#16231c",
    caixa: "rgba(8, 20, 14, 0.92)",
    borda: "#2f9e41",
    texto: "#f2f5f0",
    pensamento: "#b9d9f2",
    apagado: "#9aa8a0",
    botao: "rgba(8, 20, 14, 0.94)",
    botaoSel: "#1f5e2c",
    aviso: "rgba(232, 69, 60, 0.94)",
    avisoVerde: "rgba(47, 158, 65, 0.94)",
  },

  TITULO_JOGO: "Crônicas do IFSP",
  SUBTITULO: "Uma visual novel sobre o cotidiano do campus",

  SLOTS: 3,
  CHAVE_SAVE: "cronicasifsp.save.v2",

  MENU_PRINCIPAL: { x: 112, y: 392, w: 500, h: 62, espaco: 13 },
  MENU_PAUSA: { x: 430, y: 250, w: 420, h: 60, espaco: 14 },
  MENU_SLOTS: { x: 120, y: 210, w: 820, h: 84, espaco: 14 },
  MENU_CREDITOS: { x: 120, y: 600, w: 300, h: 56, espaco: 14 },

  CREDITOS: [
    { papel: "Roteiro", nome: "Júlia Carolina, 2° info" },
    { papel: "Programação", nome: "Júlia Carolina e Victor Barbosa, 2° info" },
    { papel: "Arte & Interface", nome: "Sophia Eloise, 2° info" },
    { papel: "Tecnologia", nome: "Canvas, JS, Python, CSS" },
  ],

  CAMINHOS: {
    cena: "data/cena01.json",
    assets: "data/assets.json",
    personagens: "data/personagens.json",
  },
};