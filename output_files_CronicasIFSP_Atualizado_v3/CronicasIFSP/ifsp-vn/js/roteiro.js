// ROTEIRO: só o "ponteiro" e as variáveis. Não desenha nem toca nada.
//
// nó atual + índice dentro do nó = posição na história.
// O jogo pede o próximo comando com proximo() e decide o que fazer com ele.

export class Roteiro {
  constructor(cena) {
    this.cena = cena;
    this.reiniciar();
  }

  reiniciar() {
    this.no = this.cena.inicio;
    this.indice = 0;
    this.variaveis = { ...(this.cena.variaveis ?? {}) };
  }

  // Devolve o próximo comando, ou null se o nó acabou.
  proximo() {
    const lista = this.cena.nos[this.no];
    if (!lista) {
      console.error(`Nó inexistente: "${this.no}"`);
      return null;
    }
    return lista[this.indice++] ?? null;
  }

  irPara(no) {
    if (!(no in this.cena.nos)) {
      throw new Error(`O nó "${no}" não existe em ${this.cena.id}`);
    }
    this.no = no;
    this.indice = 0;
  }

  somar(nome, valor)   { this.variaveis[nome] = (this.variaveis[nome] ?? 0) + valor; }
  definir(nome, valor) { this.variaveis[nome] = valor; }
}