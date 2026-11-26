// ROTEIRO: controla o ponteiro da história, variáveis, reputação e inventário.

export class Roteiro {
  constructor(cena) {
    this.cena = cena;
    this.reiniciar();
  }

  reiniciar() {
    this.no = this.cena.inicio;
    this.indice = 0;
    this.variaveis = { ...(this.cena.variaveis ?? {}) };
    this.reputacao = { ...(this.cena.reputacaoInicial ?? { fabiana: 50, fabio: 50 }) };
    this.inventario = JSON.parse(JSON.stringify(this.cena.inventarioInicial ?? []));
  }

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

  somar(nome, valor) {
    this.variaveis[nome] = (this.variaveis[nome] ?? 0) + valor;
  }

  definir(nome, valor) {
    this.variaveis[nome] = valor;
  }

  alterarReputacao(personagem, delta) {
    const atual = this.reputacao[personagem] ?? 50;
    this.reputacao[personagem] = Math.max(0, Math.min(100, atual + delta));
    return this.reputacao[personagem];
  }

  adicionarItem(item) {
    const existente = this.inventario.find((i) => i.id === item.id);
    if (existente) {
      existente.qtd = (existente.qtd ?? 1) + (item.qtd ?? 1);
    } else {
      this.inventario.push({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao ?? "Item do cotidiano escolar.",
        icone: item.icone ?? "🎒",
        qtd: item.qtd ?? 1,
      });
    }
  }

  removerItem(id, qtd = 1) {
    const idx = this.inventario.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    this.inventario[idx].qtd -= qtd;
    if (this.inventario[idx].qtd <= 0) {
      this.inventario.splice(idx, 1);
    }
    return true;
  }
}