// Constantes do jogo em um único lugar. Mexa aqui, não no meio da lógica.

const FAMILIA = "'Segoe UI', system-ui, sans-serif";

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
    esquerda: { x: 280,  escala: 1 },
    centro:   { x: 640,  escala: 1 },
    direita:  { x: 1000, escala: 1 },
    fundo:    { x: 960,  escala: 0.6 },
  },

  FONTES: {
    texto:      `24px ${FAMILIA}`,
    pensamento: `italic 24px ${FAMILIA}`,
    nome:       `bold 28px ${FAMILIA}`,
    acao:       `italic 20px ${FAMILIA}`,
    botao:      `24px ${FAMILIA}`,
    titulo:     `bold 52px ${FAMILIA}`,
    pequena:    `18px ${FAMILIA}`,
    debug:      "14px monospace",
  },

  // Teclas que avançam o diálogo
  TECLAS_AVANCAR: ["Space", "Enter", "ArrowRight"],

  VOLUME: { musica: 0.4, sfx: 0.8 },

  COR: {
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

  CAMINHOS: {
    cena: "data/cena01.json",
    assets: "data/assets.json",
    personagens: "data/personagens.json",
  },
};