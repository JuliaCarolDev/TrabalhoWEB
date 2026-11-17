// Constantes do jogo em um único lugar. Mexa aqui, não no meio da lógica.

const FAMILIA = "'Nunito', 'Segoe UI', system-ui, sans-serif";
const MARCADOR = "'Permanent Marker', 'Segoe Print', 'Comic Sans MS', cursive";

export const CONFIG = {
  // Resolução LÓGICA: o jogo sempre "pensa" em 1280x720.
  // O CSS escala o canvas para caber na janela (ver style.css).
  LARGURA: 1280,
  ALTURA: 720,

  // Modo de teste: mostra variáveis, nó atual e log de eventos (F2 liga/desliga)
  DEBUG: true,

  // Caixa de diálogo
  CAIXA: { x: 60, y: 470, largura: 1160, altura: 230 },
  ALTURA_LINHA: 32,
  CARACTERES_POR_SEGUNDO: 40,   // velocidade da "máquina de escrever"

  // Botões da tela de escolha
  BOTAO: { largura: 1000, altura: 84, espaco: 20 },

  // Sprites (placeholders usam este tamanho; imagens reais são escaladas pela altura)
  SPRITE: { largura: 300, altura: 480, base: 520 },
  POSICOES: {
    esquerda: { x: 280, escala: 1 },
    centro: { x: 640, escala: 1 },
    direita: { x: 1000, escala: 1 },
    fundo: { x: 960, escala: 0.6 },
  },

  FONTES: {
    texto: `24px ${FAMILIA}`,
    pensamento: `italic 24px ${FAMILIA}`,
    nome: `bold 28px ${FAMILIA}`,
    acao: `italic 20px ${FAMILIA}`,
    botao: `24px ${FAMILIA}`,
    titulo: `92px ${MARCADOR}`,
    titulo2: `56px ${MARCADOR}`,
    titulo3: `22px ${MARCADOR}`,
    menu: `bold 28px ${FAMILIA}`,
    pequena: `18px ${FAMILIA}`,
    debug: "14px monospace",
  },

  // Teclas que avançam o diálogo
  TECLAS_AVANCAR: ["Space", "Enter", "ArrowRight"],

  VOLUME: { musica: 0.4, sfx: 0.8 },

  COR: {
    lousa: "#13241b",
    giz: "#f1efe6",
    verde: "#2f9e41",
    vermelho: "#d9342b",
    fundo: "#16231c",
    caixa: "rgba(8, 20, 14, 0.9)",
    borda: "#2f9e41",
    texto: "#f2f5f0",
    pensamento: "#b9d9f2",
    apagado: "#9aa8a0",
    botao: "rgba(8, 20, 14, 0.94)",
    botaoSel: "#1f5e2c",
    aviso: "rgba(232, 69, 60, 0.92)",
  },

  TITULO_JOGO: "Crônicas do IFSP",
  SUBTITULO: "Uma visual novel sobre o cotidiano do campus",

  // Salvamento (localStorage do navegador)
  SLOTS: 3,
  CHAVE_SAVE: "cronicasifsp.save.v1",

  // Menus: posição do 1º botão, tamanho e espaço entre botões
  MENU_PRINCIPAL: { x: 120, y: 410, w: 420, h: 56, espaco: 14 },
  MENU_PAUSA: { x: 430, y: 250, w: 420, h: 60, espaco: 14 },
  MENU_SLOTS: { x: 120, y: 210, w: 820, h: 84, espaco: 14 },
  MENU_CREDITOS: { x: 120, y: 600, w: 300, h: 56, espaco: 14 },

  // Edite à vontade
  CREDITOS: [
    { papel: "Roteiro", nome: "Júlia Carolina, 2° info" },
    { papel: "Programação", nome: "Júlia Carolina, 2° info e Victor Barbosa, 2° info" },
    { papel: "Arte", nome: "Sophia Eloise, 2° info" },
    { papel: "Música e sons", nome: "Álguem" },
    { papel: "Feito com", nome: "Python, HTML, CSS e Canvas" },
  ],

  CAMINHOS: {
    cena: "data/cena01.json",
    assets: "data/assets.json",
    personagens: "data/personagens.json",
  },
};