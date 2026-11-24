// MENU (navegação e estado de botões no canvas)
//
// Gerencia uma lista de botões verticais (hover, setas, clique, Enter).

export class Menu {
  constructor(itens, layout) {
    this.itens = itens;     // [{ texto, detalhe?, vazio? }, ...]
    this.layout = layout;   // { x, y, w, h, espaco }
    this.selecionado = 0;
    this.mouseAnterior = { x: -1, y: -1 };
  }

  botoes() {
    const { x, y, w, h, espaco } = this.layout;
    return this.itens.map((item, i) => ({
      x,
      y: y + i * (h + espaco),
      w,
      h,
      item,
      indice: i,
    }));
  }

  atualizar(entrada) {
    const n = this.itens.length;
    if (n === 0) return -1;

    const m = entrada.mouse;
    const botoes = this.botoes();

    // Hover só muda seleção se o mouse realmente se moveu
    if (m.x !== this.mouseAnterior.x || m.y !== this.mouseAnterior.y) {
      this.mouseAnterior = { x: m.x, y: m.y };
      const idx = this._sobMouse(m, botoes);
      if (idx >= 0) this.selecionado = idx;
    }

    if (entrada.apertou("ArrowUp") || entrada.apertou("KeyW")) {
      this.selecionado = (this.selecionado - 1 + n) % n;
    }
    if (entrada.apertou("ArrowDown") || entrada.apertou("KeyS")) {
      this.selecionado = (this.selecionado + 1) % n;
    }

    // Atalhos numéricos 1..9
    for (let i = 0; i < Math.min(n, 9); i++) {
      if (entrada.apertou(`Digit${i + 1}`) || entrada.apertou(`Numpad${i + 1}`)) {
        return i;
      }
    }

    if (entrada.cliqueNesteFrame) {
      const idx = this._sobMouse(m, botoes);
      if (idx >= 0) return idx;
    }

    if (entrada.apertou("Enter") || entrada.apertou("Space")) {
      return this.selecionado;
    }

    return -1;
  }

  _sobMouse(m, botoes) {
    return botoes.findIndex(
      (b) => m.x >= b.x && m.x <= b.x + b.w && m.y >= b.y && m.y <= b.y + b.h
    );
  }
}
