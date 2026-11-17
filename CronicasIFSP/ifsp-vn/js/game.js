// NÚCLEO DO JOGO
//
// Três ideias clássicas de visual novel indie aparecem aqui:
//
// 1) MÁQUINA DE ESTADOS: o jogo está sempre em UM estado
//    (CARREGANDO, DIALOGO, FIM...) e cada estado sabe atualizar/desenhar.
//
// 2) ROTEIRO COMO DADOS: a história fica em JSON (data/cena01.json), não no
//    código. Cada "linha" é um nó: { personagem, texto }. O motor só percorre
//    a lista com um ponteiro (indiceLinha). Escrever história = editar JSON.
//
// 3) DELTA TIME: animações usam o tempo real entre frames, então o texto
//    aparece na mesma velocidade em monitor de 60 Hz ou 144 Hz.

import { CONFIG } from "./config.js";
import { Entrada } from "./input.js";

const Estado = Object.freeze({
  CARREGANDO: "carregando",
  DIALOGO: "dialogo",
  FIM: "fim",
  ERRO: "erro",
});

export class Jogo {
  constructor(canvas) {
    // ---- Configuração do Canvas ----
    this.canvas = canvas;
    this.canvas.width = CONFIG.LARGURA;      // resolução interna fixa
    this.canvas.height = CONFIG.ALTURA;
    this.ctx = canvas.getContext("2d");

    this.entrada = new Entrada(canvas);

    // ---- Estado do jogo ----
    this.estado = Estado.CARREGANDO;
    this.cena = null;           // objeto carregado do JSON
    this.indiceLinha = 0;       // ponteiro no roteiro
    this.caracteresVisiveis = 0;// progresso da máquina de escrever
    this.mensagemErro = "";

    // ---- Controle do loop ----
    this.ultimoTempo = 0;
    this._loop = this._loop.bind(this);
  }

  // ---------- Inicialização ----------

  async iniciar() {
    try {
      const resposta = await fetch(CONFIG.CAMINHO_CENA);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      this.cena = await resposta.json();
      this.estado = Estado.DIALOGO;
    } catch (erro) {
      this.mensagemErro = `Não foi possível carregar a cena (${erro.message}). Rode: python server.py`;
      this.estado = Estado.ERRO;
    }
    this.canvas.focus();
    requestAnimationFrame(this._loop);   // inicia o Loop Principal
  }

  // ---------- Loop Principal ----------

  _loop(agora) {
    // dt em SEGUNDOS. Limitamos para não "pular" a animação
    // quando a aba fica em segundo plano e volta.
    const dt = Math.min((agora - this.ultimoTempo) / 1000, 0.1);
    this.ultimoTempo = agora;

    this.atualizar(dt);
    this.desenhar();
    this.entrada.fimDoFrame();           // limpa os "eventos de um frame"

    requestAnimationFrame(this._loop);   // agenda o próximo frame
  }

  // ---------- Lógica ----------

  atualizar(dt) {
    switch (this.estado) {
      case Estado.DIALOGO:
        this._atualizarDialogo(dt);
        break;
      case Estado.FIM:
        if (this.entrada.querAvancar()) this._reiniciar();
        break;
    }
  }

  _atualizarDialogo(dt) {
    const linha = this._linhaAtual();
    const total = linha.texto.length;

    // Máquina de escrever
    if (this.caracteresVisiveis < total) {
      this.caracteresVisiveis = Math.min(
        total,
        this.caracteresVisiveis + CONFIG.CARACTERES_POR_SEGUNDO * dt
      );
    }

    if (this.entrada.querAvancar()) {
      if (this.caracteresVisiveis < total) {
        // 1º clique: completa o texto na hora
        this.caracteresVisiveis = total;
      } else {
        // 2º clique: próxima linha
        this._proximaLinha();
      }
    }
  }

  _proximaLinha() {
    this.indiceLinha++;
    this.caracteresVisiveis = 0;
    if (this.indiceLinha >= this.cena.linhas.length) {
      this.estado = Estado.FIM;
    }
  }

  _reiniciar() {
    this.indiceLinha = 0;
    this.caracteresVisiveis = 0;
    this.estado = Estado.DIALOGO;
  }

  _linhaAtual() {
    return this.cena.linhas[this.indiceLinha];
  }

  // ---------- Desenho ----------

  desenhar() {
    const { ctx } = this;
    ctx.clearRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

    this._desenharFundo();

    switch (this.estado) {
      case Estado.CARREGANDO:
        this._texto("Carregando...", CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, "center");
        break;
      case Estado.DIALOGO:
        this._desenharDialogo();
        break;
      case Estado.FIM:
        this._texto("Fim da cena — clique para recomeçar", CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, "center");
        break;
      case Estado.ERRO:
        this._texto(this.mensagemErro, CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, "center");
        break;
    }
  }

  _desenharFundo() {
    // TODO: trocar por imagem do cenário (this.cena.fundo)
    this.ctx.fillStyle = CONFIG.COR.fundo;
    this.ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
  }

  _desenharDialogo() {
    const { ctx } = this;
    const c = CONFIG.CAIXA;
    const linha = this._linhaAtual();

    // TODO: desenhar sprites dos personagens aqui (antes da caixa)

    // Caixa
    ctx.fillStyle = CONFIG.COR.caixa;
    ctx.fillRect(c.x, c.y, c.largura, c.altura);
    ctx.strokeStyle = CONFIG.COR.borda;
    ctx.lineWidth = 3;
    ctx.strokeRect(c.x, c.y, c.largura, c.altura);

    // Nome
    if (linha.personagem) {
      ctx.font = CONFIG.FONTE_NOME;
      ctx.fillStyle = CONFIG.COR.nome;
      ctx.textAlign = "left";
      ctx.fillText(linha.personagem, c.x + 28, c.y + 42);
    }

    // Texto (só a parte já "digitada")
    const visivel = linha.texto.slice(0, Math.floor(this.caracteresVisiveis));
    this._textoQuebrado(visivel, c.x + 28, c.y + 90, c.largura - 56, 36);

    // Indicador "clique para continuar"
    if (this.caracteresVisiveis >= linha.texto.length) {
      const pisca = Math.floor(this.ultimoTempo / 500) % 2 === 0;
      if (pisca) {
        ctx.fillStyle = CONFIG.COR.borda;
        ctx.fillText("▼", c.x + c.largura - 44, c.y + c.altura - 22);
      }
    }
  }

  // ---------- Utilitários de texto ----------

  _texto(str, x, y, alinhamento = "left") {
    this.ctx.font = CONFIG.FONTE;
    this.ctx.fillStyle = CONFIG.COR.texto;
    this.ctx.textAlign = alinhamento;
    this.ctx.fillText(str, x, y);
  }

  // Canvas não quebra linha sozinho: medimos palavra por palavra.
  _textoQuebrado(str, x, y, larguraMax, alturaLinha) {
    const { ctx } = this;
    ctx.font = CONFIG.FONTE;
    ctx.fillStyle = CONFIG.COR.texto;
    ctx.textAlign = "left";

    let linhaAtual = "";
    for (const palavra of str.split(" ")) {
      const teste = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
      if (ctx.measureText(teste).width > larguraMax && linhaAtual) {
        ctx.fillText(linhaAtual, x, y);
        linhaAtual = palavra;
        y += alturaLinha;
      } else {
        linhaAtual = teste;
      }
    }
    ctx.fillText(linhaAtual, x, y);
  }
}
