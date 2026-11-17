// Constantes do jogo em um único lugar. Mexa aqui, não no meio da lógica.

export const CONFIG = {
  // Resolução LÓGICA: o jogo sempre "pensa" em 1280x720.
  // O CSS escala o canvas para caber na janela (ver style.css).
  LARGURA: 1280,
  ALTURA: 720,

  // Caixa de diálogo
  CAIXA: { x: 60, y: 500, largura: 1160, altura: 190 },

  // Texto
  FONTE: "26px 'Segoe UI', system-ui, sans-serif",
  FONTE_NOME: "bold 28px 'Segoe UI', system-ui, sans-serif",
  CARACTERES_POR_SEGUNDO: 40,   // velocidade da "máquina de escrever"

  // Teclas que avançam o diálogo
  TECLAS_AVANCAR: ["Space", "Enter", "ArrowRight"],

  // Cores (provisórias, só para o esqueleto)
  COR: {
    fundo: "#16231c",
    caixa: "rgba(8, 20, 14, 0.88)",
    borda: "#2f9e41",
    texto: "#f2f5f0",
    nome: "#e8453c",
  },

  CAMINHO_CENA: "data/cena01.json",
};
