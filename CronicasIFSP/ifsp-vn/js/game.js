// NÚCLEO DO JOGO
//
// - Máquina de estados: CARREGANDO → TITULO → DIALOGO ⇄ ESCOLHA → FIM_ATO
// - Executor de comandos: lê o roteiro (JSON) e trata cada "cmd" num switch.
//     * Comandos instantâneos (fundo, musica, sfx, somar...) rodam em sequência.
//     * Comandos que esperam o jogador (fala, pensamento, escolha...) PARAM
//       o executor; o jogo só continua quando o jogador clica.
// - Fundos e sprites ausentes viram placeholders coloridos (modo de teste).

import { CONFIG } from "./config.js";
import { Entrada } from "./input.js";
import { carregarTudo } from "./assets.js";
import { Som } from "./som.js";
import { Roteiro } from "./roteiro.js";

const Estado = Object.freeze({
  CARREGANDO: "carregando",
  TITULO: "titulo",
  DIALOGO: "dialogo",
  ESCOLHA: "escolha",
  FIM_ATO: "fim_ato",
  ERRO: "erro",
});

export class Jogo {
  constructor(canvas) {
    // ---- Configuração do Canvas ----
    this.canvas = canvas;
    this.canvas.width = CONFIG.LARGURA;
    this.canvas.height = CONFIG.ALTURA;
    this.ctx = canvas.getContext("2d");

    this.entrada = new Entrada(canvas);

    this.estado = Estado.CARREGANDO;
    this.progresso = { feitos: 0, total: 0 };
    this.mensagemErro = "";
    this.debug = CONFIG.DEBUG;

    this.dados = null;     // { cena, assets, personagens, midia }
    this.roteiro = null;
    this.som = null;
    this._zerarCena();

    this.ultimoTempo = 0;
    this._loop = this._loop.bind(this);
  }

  // Tudo que pertence a UMA execução da cena (limpo ao reiniciar)
  _zerarCena() {
    this.fundoId = null;
    this.sprites = {};          // { idPersonagem: { sprite, posicao, entrada, t } }
    this.dialogo = null;        // { tipo, quem, acao, texto, linhas }
    this.caracteres = 0;        // progresso da máquina de escrever
    this.escolha = null;
    this.selecionada = 0;
    this.mouseAnterior = { x: -1, y: -1 };
    this.avisos = [];           // notificações temporárias
    this.objetivos = [];
    this.eventos = [];          // log de depuração
    this.fimAto = null;
  }

  // ---------- Inicialização ----------

  async iniciar() {
    this.canvas.focus();
    requestAnimationFrame(this._loop);   // o loop já roda durante o carregamento

    try {
      this.dados = await carregarTudo((feitos, total) => {
        this.progresso = { feitos, total };
      });
      this.roteiro = new Roteiro(this.dados.cena);
      this.som = new Som(this.dados.midia);

      const ausentes = this.dados.midia.ausentes;
      if (ausentes.length) {
        console.warn(`${ausentes.length} arquivo(s) de mídia não encontrados (usando placeholders):`, ausentes);
      }
      this.estado = Estado.TITULO;
    } catch (erro) {
      console.error(erro);
      this.mensagemErro = `Falha ao carregar: ${erro.message}. Rode: python server.py`;
      this.estado = Estado.ERRO;
    }
  }

  // ---------- Loop Principal ----------

  _loop(agora) {
    const dt = Math.min((agora - this.ultimoTempo) / 1000, 0.1);
    this.ultimoTempo = agora;

    this.atualizar(dt);
    this.desenhar();
    this.entrada.fimDoFrame();

    requestAnimationFrame(this._loop);
  }

  // ---------- Atualização ----------

  atualizar(dt) {
    if (this.entrada.apertou("F2")) this.debug = !this.debug;
    this._atualizarTemporizadores(dt);

    switch (this.estado) {
      case Estado.TITULO:
        if (this.entrada.querAvancar()) this._avancarRoteiro();
        break;
      case Estado.DIALOGO:
        this._atualizarDialogo(dt);
        break;
      case Estado.ESCOLHA:
        this._atualizarEscolha();
        break;
      case Estado.FIM_ATO:
        if (this.entrada.querAvancar()) this._reiniciar();
        break;
    }
  }

  _atualizarTemporizadores(dt) {
    for (const s of Object.values(this.sprites)) s.t += dt;
    for (const a of this.avisos) a.resta -= dt;
    for (const e of this.eventos) e.resta -= dt;
    this.avisos = this.avisos.filter((a) => a.resta > 0);
    this.eventos = this.eventos.filter((e) => e.resta > 0);
  }

  _atualizarDialogo(dt) {
    const total = this.dialogo.texto.length;

    if (this.caracteres < total) {
      this.caracteres = Math.min(total, this.caracteres + CONFIG.CARACTERES_POR_SEGUNDO * dt);
    }

    if (this.entrada.querAvancar()) {
      if (this.caracteres < total) this.caracteres = total;   // 1º clique: completa
      else this._avancarRoteiro();                            // 2º clique: segue
    }
  }

  _atualizarEscolha() {
    const e = this.entrada;
    const opcoes = this.escolha.opcoes;
    const n = opcoes.length;
    const botoes = this._geometriaBotoes();
    const m = e.mouse;

    // Hover: só quando o mouse REALMENTE se mexeu (não briga com o teclado)
    if (m.x !== this.mouseAnterior.x || m.y !== this.mouseAnterior.y) {
      this.mouseAnterior = { x: m.x, y: m.y };
      const i = this._botaoSob(m, botoes);
      if (i >= 0) this.selecionada = i;
    }

    if (e.apertou("ArrowUp") || e.apertou("KeyW"))   this.selecionada = (this.selecionada - 1 + n) % n;
    if (e.apertou("ArrowDown") || e.apertou("KeyS")) this.selecionada = (this.selecionada + 1) % n;

    // Atalhos numéricos: 1, 2, 3...
    for (let i = 0; i < Math.min(n, 9); i++) {
      if (e.apertou(`Digit${i + 1}`) || e.apertou(`Numpad${i + 1}`)) {
        this._escolher(i);
        return;
      }
    }

    if (e.cliqueNesteFrame) {
      const i = this._botaoSob(m, botoes);
      if (i >= 0) this._escolher(i);
    } else if (e.apertou("Enter") || e.apertou("Space")) {
      this._escolher(this.selecionada);
    }
  }

  _escolher(indice) {
    const opcao = this.escolha.opcoes[indice];
    this._log(`escolha: ${opcao.texto}`);
    for (const efeito of opcao.efeitos ?? []) this._executar(efeito);
    this.escolha = null;
    try {
      this.roteiro.irPara(opcao.ir);
    } catch (erro) {
      return this._erro(erro);
    }
    this._avancarRoteiro();
  }

  _reiniciar() {
    this.som.pararMusica();
    this.roteiro.reiniciar();
    this._zerarCena();
    this.estado = Estado.TITULO;
  }

  _erro(erro) {
    console.error(erro);
    this.mensagemErro = erro.message;
    this.estado = Estado.ERRO;
  }

  // ---------- Executor de comandos ----------

  // Roda comandos até encontrar um que espera o jogador.
  _avancarRoteiro() {
    try {
      for (let i = 0; i < 2000; i++) {
        const cmd = this.roteiro.proximo();
        if (!cmd) {
          this._entrarFimAto({ titulo: "Fim do roteiro", proximo: null });
          return;
        }
        if (this._executar(cmd)) return;   // true = precisa esperar
      }
      throw new Error("Roteiro em loop infinito (verifique os comandos 'ir').");
    } catch (erro) {
      this._erro(erro);
    }
  }

  // Executa UM comando. Devolve true se o jogo deve esperar o jogador.
  _executar(cmd) {
    const r = this.roteiro;

    switch (cmd.cmd) {
      // ----- instantâneos -----
      case "fundo":
        this.fundoId = cmd.id;
        this._log(`fundo: ${cmd.id}`);
        return false;

      case "musica":
        this.som.tocarMusica(cmd.id);
        this._log(cmd.id ? `música: ${cmd.id}` : "música: parar");
        return false;

      case "sfx":
        this.som.tocarSfx(cmd.id);
        this._log(`sfx: ${cmd.id}`);
        return false;

      case "mostrar":
        this.sprites[cmd.personagem] = {
          sprite: cmd.sprite,
          posicao: cmd.posicao ?? "centro",
          entrada: cmd.entrada ?? "fade",
          t: 0,
        };
        this._log(`mostrar: ${cmd.personagem}`);
        return false;

      case "esconder":
        delete this.sprites[cmd.personagem];
        this._log(`esconder: ${cmd.personagem}`);
        return false;

      case "somar":
        r.somar(cmd.var, cmd.valor);
        this._log(`${cmd.var} ${cmd.valor >= 0 ? "+" : ""}${cmd.valor} → ${r.variaveis[cmd.var]}`);
        return false;

      case "definir":
        r.definir(cmd.var, cmd.valor);
        this._log(`${cmd.var} = ${cmd.valor}`);
        return false;

      case "aviso":
        this.avisos.push({ texto: cmd.texto, resta: 3.5 });
        return false;

      case "objetivo":
        this.objetivos.push(cmd.texto);
        this.avisos.push({ texto: `Novo objetivo: ${cmd.texto}`, resta: 3.5 });
        return false;

      case "ir":
        r.irPara(cmd.no);
        this._log(`ir: ${cmd.no}`);
        return false;

      // ----- esperam o jogador -----
      case "fala":
      case "pensamento":
      case "mensagem_celular":
        this._iniciarFala(cmd);
        return true;

      case "escolha":
        this.escolha = cmd;
        this.selecionada = 0;
        this.mouseAnterior = { ...this.entrada.mouse };
        this.estado = Estado.ESCOLHA;
        return true;

      case "fim_ato":
        this._entrarFimAto(cmd);
        return true;

      default:
        console.warn("Comando desconhecido:", cmd);
        return false;
    }
  }

  _iniciarFala(cmd) {
    const tipo = cmd.cmd === "mensagem_celular" ? "celular"
               : cmd.cmd === "pensamento" ? "pensamento" : "fala";
    this.dialogo = { tipo, quem: cmd.quem ?? null, acao: cmd.acao ?? null, texto: cmd.texto, linhas: null };
    this.caracteres = 0;
    this.estado = Estado.DIALOGO;
  }

  _entrarFimAto(cmd) {
    this.fimAto = { titulo: cmd.titulo, proximo: cmd.proximo };
    this.estado = Estado.FIM_ATO;
  }

  _log(texto) {
    this.eventos.push({ texto, resta: 4 });
    if (this.eventos.length > 7) this.eventos.shift();
  }

  // ---------- Geometria dos botões (usada no clique E no desenho) ----------

  _geometriaBotoes() {
    const { largura, altura, espaco } = CONFIG.BOTAO;
    const n = this.escolha.opcoes.length;
    const total = n * altura + (n - 1) * espaco;
    const topo = Math.max(110, (CONFIG.CAIXA.y - total) / 2 + 30);
    const x = (CONFIG.LARGURA - largura) / 2;
    return this.escolha.opcoes.map((_, i) => ({ x, y: topo + i * (altura + espaco), w: largura, h: altura }));
  }

  _botaoSob(p, botoes) {
    return botoes.findIndex((b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h);
  }

  // ---------- Desenho ----------

  desenhar() {
    const { ctx } = this;
    ctx.clearRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
    this._desenharFundo();
    this._desenharSprites();

    switch (this.estado) {
      case Estado.CARREGANDO: this._desenharCarregando(); break;
      case Estado.TITULO:     this._desenharTitulo(); break;
      case Estado.DIALOGO:    this._desenharDialogo(); break;
      case Estado.ESCOLHA:    this._desenharEscolha(); break;
      case Estado.FIM_ATO:    this._desenharFimAto(); break;
      case Estado.ERRO:
        this._texto(this.mensagemErro, CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, "center");
        break;
    }

    this._desenharAvisos();
    this._desenharHud();
  }

  _desenharFundo() {
    const { ctx } = this;
    const img = this.dados?.midia.fundos[this.fundoId];

    if (img) {
      ctx.drawImage(img, 0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
      return;
    }
    // Placeholder: cor derivada do ID, para trocas de cenário ficarem visíveis
    ctx.fillStyle = this.fundoId ? this._corDoId(this.fundoId, 35, 22) : CONFIG.COR.fundo;
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
    if (this.fundoId) {
      ctx.font = CONFIG.FONTES.pequena;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "center";
      ctx.fillText(`[fundo] ${this.fundoId}`, CONFIG.LARGURA / 2, 30);
    }
  }

  _desenharSprites() {
    const { ctx } = this;
    const SP = CONFIG.SPRITE;

    for (const [quem, s] of Object.entries(this.sprites)) {
      const pos = CONFIG.POSICOES[s.posicao] ?? CONFIG.POSICOES.centro;
      const img = this.dados.midia.sprites[s.sprite];
      const h = SP.altura * pos.escala;
      const w = img ? h * (img.width / img.height) : SP.largura * pos.escala;

      // Animação de entrada
      const duracao = s.entrada === "deslizar_direita" ? 0.6 : 0.35;
      const p = Math.min(1, s.t / duracao);
      const suave = 1 - Math.pow(1 - p, 3);
      const desloc = s.entrada === "deslizar_direita" ? (1 - suave) * 220 : 0;

      const x = pos.x - w / 2 + desloc;
      const y = SP.base - h;

      ctx.save();
      ctx.globalAlpha = suave;
      if (img) {
        ctx.drawImage(img, x, y, w, h);
      } else {
        const pers = this.dados.personagens[quem];
        ctx.fillStyle = pers?.cor ?? "#888";
        ctx.globalAlpha = suave * 0.55;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = suave;
        ctx.strokeStyle = pers?.cor ?? "#888";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = CONFIG.COR.texto;
        ctx.textAlign = "center";
        ctx.font = CONFIG.FONTES.nome;
        ctx.fillText(pers?.nome || quem, x + w / 2, y + h / 2);
        ctx.font = CONFIG.FONTES.pequena;
        ctx.fillText(s.sprite, x + w / 2, y + h / 2 + 28);
      }
      ctx.restore();
    }
  }

  _desenharCarregando() {
    const { ctx } = this;
    const { feitos, total } = this.progresso;
    const cx = CONFIG.LARGURA / 2;
    this._texto(`Carregando... ${feitos}/${total}`, cx, 340, "center");
    ctx.strokeStyle = CONFIG.COR.borda;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 200, 370, 400, 16);
    ctx.fillStyle = CONFIG.COR.borda;
    ctx.fillRect(cx - 200, 370, total ? 400 * (feitos / total) : 0, 16);
  }

  _desenharTitulo() {
    const { ctx } = this;
    const cx = CONFIG.LARGURA / 2;
    ctx.font = CONFIG.FONTES.titulo;
    ctx.fillStyle = CONFIG.COR.texto;
    ctx.textAlign = "center";
    ctx.fillText(this.dados.cena.titulo, cx, 290);
    this._texto("Clique ou pressione Espaço para iniciar", cx, 360, "center");

    const n = this.dados.midia.ausentes.length;
    if (n) {
      ctx.font = CONFIG.FONTES.pequena;
      ctx.fillStyle = CONFIG.COR.apagado;
      ctx.fillText(`${n} arquivo(s) de mídia não encontrado(s): usando placeholders (veja o console)`, cx, 420);
    }
    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.fillText("F2: liga/desliga o painel de teste", cx, 450);
  }

  _desenharDialogo() {
    if (this.dialogo.tipo === "celular") this._desenharCelular();
    else this._desenharCaixa();
  }

  _desenharCaixa() {
    const { ctx } = this;
    const c = CONFIG.CAIXA;
    const d = this.dialogo;
    const pers = this.dados.personagens[d.quem];
    const pensando = d.tipo === "pensamento";
    const fonte = pensando ? CONFIG.FONTES.pensamento : CONFIG.FONTES.texto;

    ctx.fillStyle = CONFIG.COR.caixa;
    ctx.fillRect(c.x, c.y, c.largura, c.altura);
    ctx.strokeStyle = CONFIG.COR.borda;
    ctx.lineWidth = 3;
    ctx.strokeRect(c.x, c.y, c.largura, c.altura);

    // Nome do personagem (+ ação entre parênteses)
    if (pers?.nome) {
      ctx.font = CONFIG.FONTES.nome;
      ctx.fillStyle = pers.cor;
      ctx.textAlign = "left";
      ctx.fillText(pers.nome, c.x + 28, c.y + 42);
      if (d.acao) {
        const w = ctx.measureText(pers.nome).width;
        ctx.font = CONFIG.FONTES.acao;
        ctx.fillStyle = CONFIG.COR.apagado;
        ctx.fillText(`(${d.acao})`, c.x + 28 + w + 16, c.y + 42);
      }
    }

    d.linhas ??= this._quebrar(d.texto, c.largura - 56, fonte);
    ctx.font = fonte;
    ctx.fillStyle = pensando ? CONFIG.COR.pensamento : CONFIG.COR.texto;
    this._textoRevelado(d.linhas, c.x + 28, c.y + 84);

    if (this.caracteres >= d.texto.length) this._indicadorContinuar(c.x + c.largura - 44, c.y + c.altura - 20);
  }

  _desenharCelular() {
    const { ctx } = this;
    const d = this.dialogo;
    const x = 390, y = 110, w = 500, h = 300;

    this._retArredondado(x, y, w, h, 28);
    ctx.fillStyle = "#101820";
    ctx.fill();
    ctx.strokeStyle = CONFIG.COR.apagado;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "left";
    ctx.fillText("Grupo da turma", x + 32, y + 44);

    this._retArredondado(x + 28, y + 70, w - 56, h - 130, 16);
    ctx.fillStyle = "#1f5e2c";
    ctx.fill();

    d.linhas ??= this._quebrar(d.texto, w - 120, CONFIG.FONTES.texto);
    ctx.font = CONFIG.FONTES.texto;
    ctx.fillStyle = CONFIG.COR.texto;
    this._textoRevelado(d.linhas, x + 48, y + 116);

    if (this.caracteres >= d.texto.length) this._indicadorContinuar(x + w - 44, y + h - 24);
  }

  _desenharEscolha() {
    const { ctx } = this;
    const c = CONFIG.CAIXA;

    // Última fala continua visível, escurecida por trás dos botões
    if (this.dialogo && this.dialogo.tipo !== "celular") this._desenharCaixa();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

    const botoes = this._geometriaBotoes();
    if (this.escolha.titulo) {
      ctx.font = CONFIG.FONTES.nome;
      ctx.fillStyle = CONFIG.COR.texto;
      ctx.textAlign = "center";
      ctx.fillText(this.escolha.titulo, CONFIG.LARGURA / 2, botoes[0].y - 24);
    }

    botoes.forEach((b, i) => {
      const sel = i === this.selecionada;
      this._retArredondado(b.x, b.y, b.w, b.h, 12);
      ctx.fillStyle = sel ? CONFIG.COR.botaoSel : CONFIG.COR.botao;
      ctx.fill();
      ctx.strokeStyle = sel ? CONFIG.COR.borda : "#3a4a40";
      ctx.lineWidth = sel ? 3 : 2;
      ctx.stroke();

      ctx.font = CONFIG.FONTES.botao;
      ctx.fillStyle = CONFIG.COR.texto;
      ctx.textAlign = "left";
      const linhas = this._quebrar(`${i + 1}. ${this.escolha.opcoes[i].texto}`, b.w - 60, CONFIG.FONTES.botao);
      let y = b.y + b.h / 2 + 8 - (linhas.length - 1) * 15;
      for (const l of linhas) { ctx.fillText(l, b.x + 30, y); y += 30; }
    });

    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "center";
    ctx.fillText("Clique, use ↑ ↓ + Enter, ou digite o número", CONFIG.LARGURA / 2, c.y - 12);
  }

  _desenharFimAto() {
    const { ctx } = this;
    const cx = CONFIG.LARGURA / 2;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

    ctx.font = CONFIG.FONTES.titulo;
    ctx.fillStyle = CONFIG.COR.texto;
    ctx.textAlign = "center";
    ctx.fillText(this.fimAto.titulo, cx, 240);
    if (this.fimAto.proximo) this._texto(`Próximo: ${this.fimAto.proximo}`, cx, 300, "center");

    let y = 380;
    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    for (const [nome, valor] of Object.entries(this.roteiro.variaveis)) {
      ctx.fillText(`${nome}: ${valor}`, cx, y);
      y += 26;
    }
    ctx.fillText("Clique para reiniciar o teste", cx, y + 30);
  }

  // Avisos (centro-topo)
  _desenharAvisos() {
    const { ctx } = this;
    this.avisos.slice(-2).forEach((a, i) => {
      ctx.font = CONFIG.FONTES.pequena;
      const w = ctx.measureText(a.texto).width + 48;
      const x = (CONFIG.LARGURA - w) / 2;
      const y = 56 + i * 52;
      ctx.globalAlpha = Math.min(1, a.resta / 0.5);
      this._retArredondado(x, y, w, 40, 10);
      ctx.fillStyle = CONFIG.COR.aviso;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(a.texto, CONFIG.LARGURA / 2, y + 26);
      ctx.globalAlpha = 1;
    });
  }

  // Painel de teste: nó, variáveis, objetivos e log de eventos
  _desenharHud() {
    if (!this.roteiro) return;
    const { ctx } = this;
    ctx.font = CONFIG.FONTES.debug;
    ctx.textAlign = "left";

    const linhas = [];
    if (this.debug) {
      linhas.push(`nó: ${this.roteiro.no} #${this.roteiro.indice}`);
      for (const [k, v] of Object.entries(this.roteiro.variaveis)) linhas.push(`${k}: ${v}`);
    }
    for (const o of this.objetivos) { linhas.push("Objetivo:"); linhas.push(` ${o}`); }

    if (linhas.length) {
      const w = Math.max(...linhas.map((l) => ctx.measureText(l).width)) + 20;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(8, 8, w, linhas.length * 18 + 10);
      ctx.fillStyle = "#c8f0cf";
      linhas.forEach((l, i) => ctx.fillText(l, 18, 27 + i * 18));
    }

    if (this.debug) {
      ctx.textAlign = "right";
      this.eventos.forEach((e, i) => {
        ctx.globalAlpha = Math.min(1, e.resta / 0.6);
        ctx.fillStyle = "#ffe08a";
        ctx.fillText(e.texto, CONFIG.LARGURA - 12, 24 + i * 18);
      });
      ctx.globalAlpha = 1;
    }
  }

  // ---------- Utilitários de desenho ----------

  _texto(str, x, y, alinhamento = "left") {
    this.ctx.font = CONFIG.FONTES.texto;
    this.ctx.fillStyle = CONFIG.COR.texto;
    this.ctx.textAlign = alinhamento;
    this.ctx.fillText(str, x, y);
  }

  // Canvas não quebra linha sozinho: medimos palavra por palavra.
  _quebrar(str, larguraMax, fonte) {
    const { ctx } = this;
    ctx.font = fonte;
    const linhas = [];
    let atual = "";
    for (const palavra of str.split(" ")) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (ctx.measureText(teste).width > larguraMax && atual) {
        linhas.push(atual);
        atual = palavra;
      } else {
        atual = teste;
      }
    }
    linhas.push(atual);
    return linhas;
  }

  // Máquina de escrever sobre linhas JÁ quebradas (as palavras não "pulam" de linha)
  _textoRevelado(linhas, x, y) {
    let restante = Math.floor(this.caracteres);
    this.ctx.textAlign = "left";
    for (const linha of linhas) {
      if (restante <= 0) break;
      this.ctx.fillText(linha.slice(0, restante), x, y);
      restante -= linha.length + 1;
      y += CONFIG.ALTURA_LINHA;
    }
  }

  _indicadorContinuar(x, y) {
    if (Math.floor(this.ultimoTempo / 500) % 2 !== 0) return;
    this.ctx.font = CONFIG.FONTES.texto;
    this.ctx.fillStyle = CONFIG.COR.borda;
    this.ctx.textAlign = "left";
    this.ctx.fillText("▼", x, y);
  }

  _retArredondado(x, y, w, h, r) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Cor estável derivada do texto (placeholders)
  _corDoId(id, sat, luz) {
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${h}, ${sat}%, ${luz}%)`;
  }
}