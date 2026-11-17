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
import { Menu } from "./menu.js";
import { Salvamento } from "./salvamento.js";
import { desenharLousa, desenharCracha, desenharTitulo, desenharTituloJogo, desenharMenu, desenharFimAtoEstilizado } from "./visual.js";

const Estado = Object.freeze({
  CARREGANDO: "carregando",
  MENU: "menu",
  SLOTS: "slots",
  CREDITOS: "creditos",
  PAUSA: "pausa",
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

    this.menu = null;            // menu aberto no momento (principal, pausa, slots...)
    this.slotsModo = "carregar"; // "carregar" | "salvar"
    this.origem = "menu";        // de onde a tela de slots foi aberta
    this.estadoPausado = null;   // estado do jogo enquanto está em pausa

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
      this._abrirMenu();
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

    if (this.entrada.apertou("Escape") && this._aoApertarEsc()) return;

    switch (this.estado) {
      case Estado.MENU:
        this._atualizarMenuPrincipal();
        break;
      case Estado.SLOTS:
        this._atualizarSlots();
        break;
      case Estado.CREDITOS:
        if (this.menu.atualizar(this.entrada) === 0) this._voltar();
        break;
      case Estado.PAUSA:
        this._atualizarPausa();
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

    if (e.apertou("ArrowUp") || e.apertou("KeyW")) this.selecionada = (this.selecionada - 1 + n) % n;
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
    this._abrirMenu();
  }

  _erro(erro) {
    console.error(erro);
    this.mensagemErro = erro.message;
    this.estado = Estado.ERRO;
  }

  // ---------- Menus, pausa e salvamento ----------

  _abrirMenu() {
    this.estado = Estado.MENU;
    this.menu = new Menu(
      [{ texto: "Novo jogo" }, { texto: "Jogos salvos" }, { texto: "Créditos" }],
      CONFIG.MENU_PRINCIPAL
    );
  }

  _atualizarMenuPrincipal() {
    const i = this.menu.atualizar(this.entrada);
    if (i === 0) this._novoJogo();
    else if (i === 1) this._abrirSlots("carregar", "menu");
    else if (i === 2) this._abrirCreditos();
  }

  _novoJogo() {
    this.som.pararMusica();
    this.roteiro.reiniciar();
    this._zerarCena();
    this._avancarRoteiro();
  }

  _abrirCreditos() {
    this.estado = Estado.CREDITOS;
    this.menu = new Menu([{ texto: "Voltar" }], CONFIG.MENU_CREDITOS);
  }

  // Esc: pausa durante o jogo; volta uma tela nos outros menus
  _aoApertarEsc() {
    switch (this.estado) {
      case Estado.DIALOGO:
      case Estado.ESCOLHA:
        this.estadoPausado = this.estado;
        this._montarMenuPausa();
        return true;
      case Estado.PAUSA:
        this._retomar();
        return true;
      case Estado.SLOTS:
      case Estado.CREDITOS:
        this._voltar();
        return true;
      default:
        return false;
    }
  }

  _montarMenuPausa() {
    this.estado = Estado.PAUSA;
    this.menu = new Menu(
      [{ texto: "Continuar" }, { texto: "Salvar jogo" }, { texto: "Carregar jogo" }, { texto: "Voltar ao menu" }],
      CONFIG.MENU_PAUSA
    );
  }

  _retomar() {
    this.estado = this.estadoPausado;
    this.menu = null;
  }

  _atualizarPausa() {
    const i = this.menu.atualizar(this.entrada);
    if (i === 0) this._retomar();
    else if (i === 1) this._abrirSlots("salvar", "pausa");
    else if (i === 2) this._abrirSlots("carregar", "pausa");
    else if (i === 3) {
      this.som.pararMusica();
      this.roteiro.reiniciar();
      this._zerarCena();
      this._abrirMenu();
    }
  }

  _abrirSlots(modo, origem) {
    this.slotsModo = modo;
    this.origem = origem;
    this.estado = Estado.SLOTS;
    const itens = [];
    for (let n = 1; n <= CONFIG.SLOTS; n++) {
      const s = Salvamento.ler(n);
      const quando = s ? new Date(s.quando).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";
      itens.push({ texto: `Slot ${n}`, vazio: !s, detalhe: s ? `${quando}  –  ${s.trecho}` : "Vazio" });
    }
    itens.push({ texto: "Voltar" });
    this.menu = new Menu(itens, CONFIG.MENU_SLOTS);
  }

  _atualizarSlots() {
    const i = this.menu.atualizar(this.entrada);
    if (i < 0) return;
    if (i === CONFIG.SLOTS) this._voltar();
    else this._usarSlot(i + 1);
  }

  _usarSlot(n) {
    if (this.slotsModo === "salvar") {
      const ok = Salvamento.gravar(n, this._snapshot());
      this._aviso(ok ? `Jogo salvo no slot ${n}` : "Não foi possível salvar (armazenamento bloqueado)");
      this._voltar();
      return;
    }
    const s = Salvamento.ler(n);
    if (!s) return this._aviso(`O slot ${n} está vazio`);
    if (!(s.no in this.dados.cena.nos)) return this._aviso("Este save não combina com o roteiro atual");
    this._restaurar(s);
  }

  _voltar() {
    if (this.estado === Estado.SLOTS && this.origem === "pausa") this._montarMenuPausa();
    else this._abrirMenu();
  }

  _aviso(texto) {
    this.avisos.push({ texto, resta: 3.5 });
  }

  // Foto do estado atual. Salvamos no comando que está ESPERANDO o jogador
  // (indice - 1), então ao carregar ele é lido de novo e a cena continua igual.
  _snapshot() {
    const r = this.roteiro;
    const bruto = this.estadoPausado === Estado.ESCOLHA ? (this.escolha.titulo ?? "Escolha") : (this.dialogo?.texto ?? "");
    return {
      quando: new Date().toISOString(),
      trecho: bruto.length > 70 ? `${bruto.slice(0, 67)}…` : bruto,
      no: r.no,
      indice: Math.max(0, r.indice - 1),
      variaveis: { ...r.variaveis },
      fundoId: this.fundoId,
      sprites: Object.fromEntries(Object.entries(this.sprites).map(([q, s]) => [q, { sprite: s.sprite, posicao: s.posicao }])),
      musica: this.som.idMusica,
      objetivos: [...this.objetivos],
    };
  }

  _restaurar(s) {
    this.som.pararMusica();
    this._zerarCena();
    const r = this.roteiro;
    r.no = s.no;
    r.indice = s.indice;
    r.variaveis = { ...s.variaveis };
    this.fundoId = s.fundoId;
    this.objetivos = [...s.objetivos];
    for (const [quem, sp] of Object.entries(s.sprites)) this.sprites[quem] = { ...sp, entrada: "fade", t: 0 };
    this.som.tocarMusica(s.musica);
    this._avancarRoteiro();
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
    if ([Estado.MENU, Estado.SLOTS, Estado.CREDITOS].includes(this.estado)) {
      desenharLousa(ctx);
    } else {
      this._desenharFundo();
      this._desenharSprites();
    }

    switch (this.estado) {
      case Estado.CARREGANDO: this._desenharCarregando(); break;
      case Estado.MENU: this._desenharMenuPrincipal(); break;
      case Estado.SLOTS: this._desenharSlots(); break;
      case Estado.CREDITOS: this._desenharCreditos(); break;
      case Estado.PAUSA: this._desenharPausa(); break;
      case Estado.DIALOGO: this._desenharDialogo(); break;
      case Estado.ESCOLHA: this._desenharEscolha(); break;
      case Estado.FIM_ATO: this._desenharFimAto(); break;
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

  _desenharMenuPrincipal() {
    desenharCracha(this.ctx, 1000, -20, this.ultimoTempo / 1000);
    desenharTituloJogo(this.ctx);
    desenharMenu(this.ctx, this.menu);
    this._dica("Mouse, setas e Enter");
  }

  _desenharSlots() {
    desenharTitulo(this.ctx, this.slotsModo === "salvar" ? "Salvar jogo" : "Jogos salvos", 120, 150);
    desenharMenu(this.ctx, this.menu);
    this._dica("Esc volta");
  }

  _desenharCreditos() {
    const { ctx } = this;
    desenharTitulo(ctx, "Créditos", 120, 150);
    CONFIG.CREDITOS.forEach((c, i) => {
      const y = 230 + i * 70;
      ctx.textAlign = "left";
      ctx.font = CONFIG.FONTES.pequena;
      ctx.fillStyle = CONFIG.COR.apagado;
      ctx.fillText(c.papel, 124, y);
      ctx.font = CONFIG.FONTES.menu;
      ctx.fillStyle = CONFIG.COR.giz;
      ctx.fillText(c.nome, 124, y + 34);
    });
    desenharMenu(ctx, this.menu);
  }

  _desenharPausa() {
    const { ctx } = this;
    if (this.estadoPausado === Estado.ESCOLHA) this._desenharEscolha();
    else this._desenharDialogo();
    ctx.fillStyle = "rgba(0,0,0,0.68)";
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
    desenharTitulo(ctx, "Pausa", CONFIG.LARGURA / 2, 190, "center");
    desenharMenu(this.ctx, this.menu);
  }

  _dica(texto) {
    this.ctx.font = CONFIG.FONTES.pequena;
    this.ctx.fillStyle = CONFIG.COR.apagado;
    this.ctx.textAlign = "left";
    this.ctx.fillText(texto, 124, 690);
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
    desenharFimAtoEstilizado(this.ctx, this.fimAto, this.roteiro.variaveis, this.ultimoTempo / 1000);
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

  // Ficha do aluno (painel lateral - esquerda normalmente, direita na escolha para não sobrepor)
  _desenharHud() {
    if (!this.roteiro) return;
    if (![Estado.DIALOGO, Estado.ESCOLHA, Estado.PAUSA].includes(this.estado)) return;
    const { ctx } = this;
    const rotulos = this.dados.cena.rotulos ?? {};

    // Se estiver em estado de escolha, move para o canto superior direito para não encobrir as opções
    const ehEscolha = this.estado === Estado.ESCOLHA;
    const x = ehEscolha ? CONFIG.LARGURA - 308 : 12;
    const y = 12;
    const w = 296;

    const linhas = Object.entries(this.roteiro.variaveis).map(([k, v]) => {
      const r = rotulos[k];
      if (!r) return { nome: k, valor: String(v) };
      if (typeof v === "boolean") return { nome: r.nome, valor: v ? r.verdadeiro : r.falso };
      const barra = r.unidade === "%" ? Math.max(0, Math.min(100, v)) / 100 : null;
      return { nome: r.nome, valor: `${v}${r.unidade ?? ""}`, barra, cor: r.cor ?? CONFIG.COR.verde };
    });
    const objetivos = this.objetivos.flatMap((o) => this._quebrar(o, w - 36, CONFIG.FONTES.pequena));

    let altura = 44 + linhas.reduce((soma, l) => soma + (l.barra != null ? 40 : 26), 0);
    if (objetivos.length) altura += 30 + objetivos.length * 22;

    this._retArredondado(x, y, w, altura, 10);
    ctx.fillStyle = "rgba(8, 20, 14, 0.88)";
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 158, 65, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = CONFIG.COR.verde;
    ctx.fillRect(x, y + 10, 6, altura - 20);

    ctx.textAlign = "left";
    ctx.font = CONFIG.FONTES.titulo3;
    ctx.fillStyle = CONFIG.COR.giz;
    ctx.fillText("Ficha do aluno", x + 22, y + 32);

    let py = y + 60;
    ctx.font = CONFIG.FONTES.pequena;
    for (const l of linhas) {
      ctx.textAlign = "left";
      ctx.fillStyle = CONFIG.COR.apagado;
      ctx.fillText(l.nome, x + 22, py);
      ctx.textAlign = "right";
      ctx.fillStyle = CONFIG.COR.giz;
      ctx.fillText(l.valor, x + w - 14, py);
      if (l.barra != null) {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(x + 22, py + 8, w - 36, 6);
        ctx.fillStyle = l.cor;
        ctx.fillRect(x + 22, py + 8, (w - 36) * l.barra, 6);
        py += 40;
      } else {
        py += 26;
      }
    }

    ctx.textAlign = "left";
    if (objetivos.length) {
      ctx.fillStyle = CONFIG.COR.apagado;
      ctx.fillText("Objetivo", x + 22, py + 4);
      ctx.fillStyle = CONFIG.COR.giz;
      objetivos.forEach((l, i) => ctx.fillText(l, x + 22, py + 28 + i * 22));
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