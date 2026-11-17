// ENTRADA (teclado + mouse)
//
// Técnica usada em quase todo jogo: os escutadores de evento NÃO executam
// lógica do jogo. Eles só ANOTAM o que aconteceu. O loop principal lê essas
// anotações uma vez por frame e depois as limpa (fimDoFrame).
// Isso evita que um clique "dispare" no meio de um desenho e mantém
// toda a lógica num lugar só.

import { CONFIG } from "./config.js";

export class Entrada {
  constructor(canvas) {
    this.canvas = canvas;

    this.teclasSegurando = new Set();   // keydown ... keyup (estado contínuo)
    this.teclasApertadas = new Set();   // só no frame em que apertou
    this.mouse = { x: 0, y: 0 };        // em coordenadas LÓGICAS do jogo
    this.cliqueNesteFrame = false;

    this._registrarEventos();
  }

  _registrarEventos() {
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;                          // ignora tecla segurada
      if (CONFIG.TECLAS_AVANCAR.includes(e.code)) e.preventDefault(); // Espaço não rola a página
      this.teclasSegurando.add(e.code);
      this.teclasApertadas.add(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this.teclasSegurando.delete(e.code);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse = this._paraCoordenadasLogicas(e);
    });

    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse = this._paraCoordenadasLogicas(e);
      this.cliqueNesteFrame = true;
    });

    // Se a aba perder o foco, solta tudo (evita tecla "presa")
    window.addEventListener("blur", () => this.teclasSegurando.clear());
  }

  // O canvas é exibido em tamanho diferente do lógico (1280x720).
  // Aqui convertemos pixel da tela -> pixel do jogo.
  _paraCoordenadasLogicas(evento) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (evento.clientX - r.left) * (CONFIG.LARGURA / r.width),
      y: (evento.clientY - r.top) * (CONFIG.ALTURA / r.height),
    };
  }

  // ---- Consultas que o jogo usa ----

  apertou(codigo)  { return this.teclasApertadas.has(codigo); }
  segurando(codigo){ return this.teclasSegurando.has(codigo); }

  // "O jogador pediu para avançar?" (clique OU qualquer tecla de avanço)
  querAvancar() {
    return this.cliqueNesteFrame ||
           CONFIG.TECLAS_AVANCAR.some((t) => this.teclasApertadas.has(t));
  }

  // Chamado pelo loop no FINAL de cada frame
  fimDoFrame() {
    this.teclasApertadas.clear();
    this.cliqueNesteFrame = false;
  }
}
