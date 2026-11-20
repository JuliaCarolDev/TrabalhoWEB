// NÚCLEO DO JOGO
// Inclui: Barra inferior discreta, Histórico, Pular, Automático, Salvar/Carregar preciso,
// Reputação por personagem, Inventário e Configurações.

import { CONFIG } from "./config.js";
import { Entrada } from "./input.js";
import { carregarTudo } from "./assets.js";
import { Som } from "./som.js";
import { Roteiro } from "./roteiro.js";
import { Menu } from "./menu.js";
import { Salvamento } from "./salvamento.js";
import {
  desenharLousa,
  desenharCracha,
  desenharTitulo,
  desenharTituloJogo,
  desenharMenu,
  desenharMenuInicial,
  desenharBarraInferior,
  desenharStatusCompacto,
  desenharModalHistorico,
  desenharModalReputacao,
  desenharModalInventario,
  desenharModalConfiguracoes,
  desenharFimAtoEstilizado,
  desenharAberturaAto,
  desenharTelaFinal,
  desenharCenasExtras,
} from "./visual.js";

const Estado = Object.freeze({
  CARREGANDO: "carregando",
  MENU: "menu",
  INTRO_ATO: "intro_ato",
  SLOTS: "slots",
  CREDITOS: "creditos",
  PAUSA: "pausa",
  DIALOGO: "dialogo",
  ESCOLHA: "escolha",
  HISTORICO: "historico",
  REPUTACAO: "reputacao",
  INVENTARIO: "inventario",
  CONFIGURACOES: "configuracoes",
  FIM_ATO: "fim_ato",
  FINAL: "final",
  CENAS_EXTRAS: "cenas_extras",
  ERRO: "erro",
});

export class Jogo {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = CONFIG.LARGURA;
    this.canvas.height = CONFIG.ALTURA;
    this.ctx = canvas.getContext("2d");

    this.entrada = new Entrada(canvas);

    this.estado = Estado.CARREGANDO;
    this.progresso = { feitos: 0, total: 0 };
    this.mensagemErro = "";
    this.debug = CONFIG.DEBUG;

    this.menu = null;
    this.introAtoTempo = 0;
    this.introAtoDuracao = 4.6;
    this.introAtoTitulo = "O começo de tudo";
    this.introAtoNumero = "I";
    this.slotsModo = "carregar";
    this.origem = "menu";
    this.estadoAnteriorModal = null;

    // Controles de VN (Automático, Pular, Histórico, Configurações)
    this.modoAuto = false;
    this.modoPular = false;
    this.timerAuto = 0;
    this.timerPular = 0;
    this.velocidadeTexto = CONFIG.CARACTERES_POR_SEGUNDO;
    this.tempoEsperaAuto = 2.0;

    this.historico = [];
    this.scrollHistorico = 0;
    this.itemInventarioSel = 0;
    this.botoesBarra = [];

    this.dados = null;
    this.roteiro = null;
    this.som = null;
    this._zerarCena();

    this.ultimoTempo = 0;
    this._loop = this._loop.bind(this);
  }

  _zerarCena() {
    this.fundoId = null;
    this.sprites = {};
    this.dialogo = null;
    this.caracteres = 0;
    this.escolha = null;
    this.selecionada = 0;
    this.mouseAnterior = { x: -1, y: -1 };
    this.avisos = [];
    this.objetivos = [];
    this.eventos = [];
    this.historico = [];
    this.scrollHistorico = 0;
    this.itemInventarioSel = 0;
    this.modoAuto = false;
    this.modoPular = false;
    this.timerAuto = 0;
    this.timerPular = 0;
    this.fimAto = null;
    this.pontoSalvo = { no: "inicio", indice: 0 };
  }

  async iniciar() {
    this.canvas.focus();
    requestAnimationFrame(this._loop);

    try {
      this.dados = await carregarTudo((feitos, total) => {
        this.progresso = { feitos, total };
      });
      this.roteiro = new Roteiro(this.dados.cena);
      this.som = new Som(this.dados.midia);
      this._abrirMenu();
    } catch (erro) {
      console.error(erro);
      this.mensagemErro = `Falha ao carregar: ${erro.message}. Rode: python server.py`;
      this.estado = Estado.ERRO;
    }
  }

  _loop(agora) {
    const dt = Math.min((agora - this.ultimoTempo) / 1000, 0.1);
    this.ultimoTempo = agora;

    this.atualizar(dt);
    this.desenhar();
    this.entrada.fimDoFrame();

    requestAnimationFrame(this._loop);
  }

  atualizar(dt) {
    if (this.entrada.apertou("F2")) this.debug = !this.debug;
    this._atualizarTemporizadores(dt);

    if (this.entrada.apertou("Escape") && this._aoApertarEsc()) return;

    switch (this.estado) {
      case Estado.MENU:
        this._atualizarMenuPrincipal();
        break;
      case Estado.INTRO_ATO:
        this._atualizarIntroAto(dt);
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
      case Estado.HISTORICO:
        this._atualizarHistorico();
        break;
      case Estado.REPUTACAO:
        if (this.entrada.cliqueNesteFrame || this.entrada.apertou("Enter") || this.entrada.apertou("Space")) {
          this._fecharModal();
        }
        break;
      case Estado.INVENTARIO:
        this._atualizarInventario();
        break;
      case Estado.CONFIGURACOES:
        this._atualizarConfiguracoes();
        break;
      case Estado.FIM_ATO:
        if (this.entrada.querAvancar()) {
          if (this.fimAto?.proximoNo) this._iniciarProximoAto();
          else this._reiniciar();
        }
        break;
      case Estado.FINAL:
        this._atualizarTelaFinal();
        break;
      case Estado.CENAS_EXTRAS:
        if (this.entrada.querAvancar() || this.entrada.apertou("Escape")) this._abrirMenu();
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

  // ---------- Barra Inferior Discreta ----------

  _verificarCliqueBarraInferior() {
    if (!this.entrada.cliqueNesteFrame || !this.botoesBarra.length) return false;
    const m = this.entrada.mouse;
    const btn = this.botoesBarra.find(
      (b) => m.x >= b.x && m.x <= b.x + b.w && m.y >= b.y && m.y <= b.y + b.h
    );
    if (!btn) return false;

    this._executarAcaoBarra(btn.id);
    return true;
  }

  _executarAcaoBarra(id) {
    switch (id) {
      case "historico":
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this.scrollHistorico = Math.max(0, this.historico.length - 6);
        this.estado = Estado.HISTORICO;
        break;
      case "pular":
        if (this.estado === Estado.DIALOGO) {
          this.modoPular = !this.modoPular;
          if (this.modoPular) this.modoAuto = false;
        }
        break;
      case "auto":
        if (this.estado === Estado.DIALOGO) {
          this.modoAuto = !this.modoAuto;
          if (this.modoAuto) this.modoPular = false;
          this.timerAuto = 0;
        }
        break;
      case "reputacao":
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this.estado = Estado.REPUTACAO;
        break;
      case "inventario":
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this.itemInventarioSel = 0;
        this.estado = Estado.INVENTARIO;
        break;
      case "salvar":
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this._abrirSlots("salvar", "jogo");
        break;
      case "config":
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this.estado = Estado.CONFIGURACOES;
        break;
    }
  }

  _fecharModal() {
    this.estado = this.estadoAnteriorModal || Estado.DIALOGO;
    this.estadoAnteriorModal = null;
  }

  // ---------- Diálogo & Modos Auto / Pular ----------

  _atualizarDialogo(dt) {
    // Atalhos rápidos de teclado
    if (this.entrada.apertou("KeyH")) return this._executarAcaoBarra("historico");
    if (this.entrada.apertou("KeyA")) return this._executarAcaoBarra("auto");
    if (this.entrada.apertou("KeyR")) return this._executarAcaoBarra("reputacao");
    if (this.entrada.apertou("KeyI")) return this._executarAcaoBarra("inventario");

    // Primeiro verifica se o jogador clicou em algum botão da barra inferior
    if (this._verificarCliqueBarraInferior()) return;

    const total = this.dialogo.texto.length;

    // Modo Pular (avança rapidamente até a próxima escolha ou fim de ato)
    if (this.modoPular) {
      this.caracteres = total;
      this.timerPular += dt;
      if (this.timerPular >= 0.14) {
        this.timerPular = 0;
        this._avancarRoteiro();
      }
      if (this.entrada.querAvancar()) this.modoPular = false;
      return;
    }

    // Revelação normal do texto
    if (this.caracteres < total) {
      this.caracteres = Math.min(total, this.caracteres + this.velocidadeTexto * dt);
    } else if (this.modoAuto) {
      this.timerAuto += dt;
      if (this.timerAuto >= this.tempoEsperaAuto) {
        this.timerAuto = 0;
        this._avancarRoteiro();
        return;
      }
    }

    if (this.entrada.querAvancar()) {
      this.timerAuto = 0;
      if (this.caracteres < total) {
        this.caracteres = total;
      } else {
        this._avancarRoteiro();
      }
    }
  }

  // ---------- Escolha ----------

  _atualizarEscolha() {
    this.modoPular = false;
    this.modoAuto = false;

    if (this._verificarCliqueBarraInferior()) return;

    const e = this.entrada;
    const opcoes = this.escolha.opcoes;
    const n = opcoes.length;
    const botoes = this._geometriaBotoes();
    const m = e.mouse;

    if (m.x !== this.mouseAnterior.x || m.y !== this.mouseAnterior.y) {
      this.mouseAnterior = { x: m.x, y: m.y };
      const i = this._botaoSob(m, botoes);
      if (i >= 0) this.selecionada = i;
    }

    if (e.apertou("ArrowUp") || e.apertou("KeyW")) this.selecionada = (this.selecionada - 1 + n) % n;
    if (e.apertou("ArrowDown") || e.apertou("KeyS")) this.selecionada = (this.selecionada + 1) % n;

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
    this.historico.push({
      quem: "Você (Escolha)",
      cor: "#7cc4ff",
      texto: `▸ ${opcao.texto}`,
    });

    for (const efeito of opcao.efeitos ?? []) this._executar(efeito);
    this.escolha = null;
    try {
      this.roteiro.irPara(opcao.ir);
    } catch (erro) {
      return this._erro(erro);
    }
    this._avancarRoteiro();
  }

  // ---------- Modais (Histórico, Inventário, Configurações) ----------

  _atualizarHistorico() {
    const e = this.entrada;
    const maxScroll = Math.max(0, this.historico.length - 6);
    if (e.apertou("ArrowUp") || e.apertou("KeyW")) {
      this.scrollHistorico = Math.max(0, this.scrollHistorico - 1);
    }
    if (e.apertou("ArrowDown") || e.apertou("KeyS")) {
      this.scrollHistorico = Math.min(maxScroll, this.scrollHistorico + 1);
    }
    if (e.cliqueNesteFrame) {
      const m = e.mouse;
      // Botão fechar no canto superior direito do modal
      if (m.x >= 960 && m.x <= 1060 && m.y >= 115 && m.y <= 155) {
        this._fecharModal();
      } else if (m.y < 360) {
        this.scrollHistorico = Math.max(0, this.scrollHistorico - 1);
      } else {
        this.scrollHistorico = Math.min(maxScroll, this.scrollHistorico + 1);
      }
    }
  }

  _atualizarInventario() {
    const e = this.entrada;
    const itens = this.roteiro.inventario;
    if (itens.length > 0) {
      if (e.apertou("ArrowUp") || e.apertou("KeyW")) {
        this.itemInventarioSel = (this.itemInventarioSel - 1 + itens.length) % itens.length;
      }
      if (e.apertou("ArrowDown") || e.apertou("KeyS")) {
        this.itemInventarioSel = (this.itemInventarioSel + 1) % itens.length;
      }
    }
    if (e.cliqueNesteFrame) {
      const m = e.mouse;
      // Verifica clique nos itens da lista
      for (let i = 0; i < itens.length; i++) {
        const iy = 215 + i * 58;
        if (m.x >= 250 && m.x <= 630 && m.y >= iy && m.y <= iy + 48) {
          this.itemInventarioSel = i;
          return;
        }
      }
      // Botão fechar
      if (m.x >= 940 && m.x <= 1040 && m.y >= 125 && m.y <= 165) {
        this._fecharModal();
      }
    }
  }

  _atualizarConfiguracoes() {
    const e = this.entrada;
    if (e.cliqueNesteFrame) {
      const m = e.mouse;
      // Controles de Música (- e +)
      if (m.y >= 245 && m.y <= 285) {
        if (m.x >= 620 && m.x <= 665) {
          CONFIG.VOLUME.musica = Math.max(0, +(CONFIG.VOLUME.musica - 0.1).toFixed(1));
          this.som.atualizarVolume();
        } else if (m.x >= 835 && m.x <= 880) {
          CONFIG.VOLUME.musica = Math.min(1, +(CONFIG.VOLUME.musica + 0.1).toFixed(1));
          this.som.atualizarVolume();
        }
      }
      // Controles de Efeitos Sonoros (- e +)
      if (m.y >= 315 && m.y <= 355) {
        if (m.x >= 620 && m.x <= 665) {
          CONFIG.VOLUME.sfx = Math.max(0, +(CONFIG.VOLUME.sfx - 0.1).toFixed(1));
        } else if (m.x >= 835 && m.x <= 880) {
          CONFIG.VOLUME.sfx = Math.min(1, +(CONFIG.VOLUME.sfx + 0.1).toFixed(1));
          this.som.tocarSfx("sfx_sinal");
        }
      }
      // Velocidade do texto
      if (m.y >= 385 && m.y <= 425) {
        if (m.x >= 620 && m.x <= 665) {
          this.velocidadeTexto = Math.max(20, this.velocidadeTexto - 15);
        } else if (m.x >= 835 && m.x <= 880) {
          this.velocidadeTexto = Math.min(120, this.velocidadeTexto + 15);
        }
      }
      // Botão Fechar
      if (m.x >= 540 && m.x <= 740 && m.y >= 490 && m.y <= 540) {
        this._fecharModal();
      }
    }
  }

  _reiniciar() {
    if (this.som) this.som.pararMusica(); // Garante que para a música ao reiniciar
    this.roteiro.reiniciar();
    this._zerarCena();
    this._abrirMenu();
  }

  _erro(erro) {
    console.error(erro);
    this.mensagemErro = erro.message;
    this.estado = Estado.ERRO;
  }

  // ---------- Menus, Pausa e Salvamento ----------

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

    // Abertura cinematográfica antes da primeira fala do roteiro.
    const tituloCena = this.dados?.cena?.titulo || "Ato I — O começo de tudo";
    const identificacaoAto = tituloCena.match(/^Ato\s*([IVXLCDM]+)/i);
    this.introAtoNumero = identificacaoAto?.[1]?.toUpperCase() || "I";
    this.introAtoTitulo = tituloCena.replace(/^Ato\s*[IVXLCDM]+\s*[—–-]\s*/i, "");
    this.introAtoTempo = 0;
    this.estado = Estado.INTRO_ATO;
  }

  _atualizarIntroAto(dt) {
    this.introAtoTempo += dt;
    // O jogador pode pular a apresentação com clique, Enter, Espaço ou →.
    if (this.introAtoTempo >= this.introAtoDuracao || this.entrada.querAvancar()) {
      this.estado = Estado.DIALOGO;
      this._avancarRoteiro();
    }
  }

  _abrirCreditos() {
    this.estado = Estado.CREDITOS;
    this.menu = new Menu([{ texto: "Voltar" }], CONFIG.MENU_CREDITOS);
  }

  _aoApertarEsc() {
    switch (this.estado) {
      case Estado.DIALOGO:
      case Estado.ESCOLHA:
        this.modoAuto = false;
        this.modoPular = false;
        this.estadoAnteriorModal = this.estado;
        this._montarMenuPausa();
        return true;
      case Estado.PAUSA:
        this._retomar();
        return true;
      case Estado.HISTORICO:
      case Estado.REPUTACAO:
      case Estado.INVENTARIO:
      case Estado.CONFIGURACOES:
        this._fecharModal();
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
    this.estado = this.estadoAnteriorModal || Estado.DIALOGO;
    this.menu = null;
  }

  _atualizarPausa() {
    const i = this.menu.atualizar(this.entrada);
    if (i === 0) this._retomar();
    else if (i === 1) this._abrirSlots("salvar", "pausa");
    else if (i === 2) this._abrirSlots("carregar", "pausa");
    else if (i === 3) {
      if (this.som) this.som.pararMusica(); // Para a música ao voltar para o menu principal
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
      this._aviso(ok ? `Progresso salvo com sucesso no Slot ${n}!` : "Erro ao salvar progresso.", true);
      this._voltar();
      return;
    }
    const s = Salvamento.ler(n);
    if (!s) return this._aviso(`O Slot ${n} está vazio.`);
    if (!(s.no in this.dados.cena.nos)) return this._aviso("Este save pertence a outra versão do roteiro.");
    this._restaurar(s);
    this._aviso(`Jogo carregado do Slot ${n}!`, true);
  }

  _voltar() {
    if (this.estado === Estado.SLOTS) {
      if (this.origem === "pausa") this._montarMenuPausa();
      else if (this.origem === "jogo") this._fecharModal();
      else this._abrirMenu();
    } else {
      this._abrirMenu();
    }
  }

  _aviso(texto, positivo = false) {
    this.avisos.push({ texto, resta: 3.2, positivo });
  }

  // Salva exatamente o comando atual onde o jogador parou
  _snapshot() {
    const r = this.roteiro;
    const origemEstado = this.estadoAnteriorModal || this.estado;
    const bruto = origemEstado === Estado.ESCOLHA
      ? (this.escolha?.titulo ?? "Decisão")
      : (this.dialogo?.texto ?? "Em andamento");

    return {
      quando: new Date().toISOString(),
      trecho: bruto.length > 65 ? `${bruto.slice(0, 62)}…` : bruto,
      no: this.pontoSalvo.no,
      indice: this.pontoSalvo.indice,
      variaveis: { ...r.variaveis },
      reputacao: { ...r.reputacao },
      inventario: JSON.parse(JSON.stringify(r.inventario)),
      fundoId: this.fundoId,
      sprites: Object.fromEntries(
        Object.entries(this.sprites).map(([q, s]) => [q, { sprite: s.sprite, posicao: s.posicao }])
      ),
      musica: this.som.idMusica,
      objetivos: [...this.objetivos],
      historico: this.historico.slice(-30),
    };
  }

  _restaurar(s) {
    this.som.pararMusica();
    this._zerarCena();
    const r = this.roteiro;
    r.no = s.no;
    r.indice = s.indice;
    r.variaveis = { ...s.variaveis };
    r.reputacao = { ...(s.reputacao ?? { fabiana: 50, fabio: 50 }) };
    r.inventario = JSON.parse(JSON.stringify(s.inventario ?? []));
    this.fundoId = s.fundoId;
    this.objetivos = [...(s.objetivos ?? [])];
    this.historico = [...(s.historico ?? [])];
    for (const [quem, sp] of Object.entries(s.sprites ?? {})) {
      this.sprites[quem] = { ...sp, entrada: "fade", t: 0 };
    }
    if (s.musica) this.som.tocarMusica(s.musica);
    this._avancarRoteiro();
  }

  // ---------- Executor de Comandos ----------

  _avancarRoteiro() {
    try {
      for (let i = 0; i < 2000; i++) {
        const noAntes = this.roteiro.no;
        const indiceAntes = this.roteiro.indice;
        const cmd = this.roteiro.proximo();

        if (!cmd) {
          this._entrarFimAto({ titulo: "Fim do Ato I", proximo: null });
          return;
        }
        if (this._executar(cmd)) {
          // Guarda a posição exata do comando que está aguardando o jogador
          this.pontoSalvo = { no: noAntes, indice: indiceAntes };
          return;
        }
      }
      throw new Error("Roteiro em loop infinito.");
    } catch (erro) {
      this._erro(erro);
    }
  }

  _executar(cmd) {
    const r = this.roteiro;

    switch (cmd.cmd) {
      case "fundo":
        this.fundoId = cmd.id;
        return false;

      case "musica":
        this.som.tocarMusica(cmd.id);
        return false;

      case "sfx":
        this.som.tocarSfx(cmd.id);
        return false;

      case "mostrar":
        this.sprites[cmd.personagem] = {
          sprite: cmd.sprite,
          posicao: cmd.posicao ?? "centro",
          entrada: cmd.entrada ?? "fade",
          t: 0,
        };
        return false;

      case "esconder":
        delete this.sprites[cmd.personagem];
        return false;

      case "somar":
        r.somar(cmd.var, cmd.valor);
        return false;

      case "definir":
        r.definir(cmd.var, cmd.valor);
        return false;

      case "reputacao": {
        const novoValor = r.alterarReputacao(cmd.personagem, cmd.valor);
        const pers = this.dados.personagens[cmd.personagem];
        const nomePers = pers?.nome || cmd.personagem;
        const sinal = cmd.valor >= 0 ? `+${cmd.valor}` : `${cmd.valor}`;
        this._aviso(`Reputação com ${nomePers}: ${sinal} (${novoValor}%)`, cmd.valor >= 0);
        return false;
      }

      case "item_adicionar":
        r.adicionarItem(cmd);
        this._aviso(`Item obtido: ${cmd.nome}`, true);
        return false;

      case "item_remover":
        if (r.removerItem(cmd.id, cmd.qtd ?? 1)) {
          this._aviso(`Item usado: ${cmd.nome || cmd.id}`, false);
        }
        return false;

      case "aviso":
        this._aviso(cmd.texto, cmd.positivo ?? false);
        return false;

      case "objetivo":
        this.objetivos.push(cmd.texto);
        this._aviso(`Novo objetivo: ${cmd.texto}`, true);
        return false;

      case "ir":
        r.irPara(cmd.no);
        return false;

      case "fala":
      case "pensamento":
      case "mensagem_celular":
        this._iniciarFala(cmd);
        return true;

      case "escolha":
        this.escolha = { ...cmd, opcoes: (cmd.opcoes ?? []).filter((op) => this._requisitoAtendido(op.requer)) };
        this.selecionada = 0;
        this.mouseAnterior = { ...this.entrada.mouse };
        this.estado = Estado.ESCOLHA;
        return true;

      case "condicional": {
        const ok = (cmd.condicoes ?? []).every((c) => this._condicaoAtendida(c));
        r.irPara(ok ? cmd.ir : cmd.senao);
        return false;
      }

      case "fim_jogo":
        this._entrarTelaFinal();
        return true;

      case "fim_ato":
        this._entrarFimAto(cmd);
        return true;

      default:
        console.warn("Comando desconhecido:", cmd);
        return false;
    }
  }

  _condicaoAtendida(condicao) {
    const valor = this.roteiro.variaveis[condicao.var];
    if (condicao.item) return this.roteiro.inventario.some((i) => i.id === condicao.item && (i.qtd ?? 1) > 0);
    if (Object.prototype.hasOwnProperty.call(condicao, "igual")) return valor === condicao.igual;
    if (Object.prototype.hasOwnProperty.call(condicao, "min")) return Number(valor ?? 0) >= condicao.min;
    if (Object.prototype.hasOwnProperty.call(condicao, "max")) return Number(valor ?? 0) <= condicao.max;
    return Boolean(valor);
  }

  _requisitoAtendido(requer) {
    if (!requer) return true;
    if (requer.any) return requer.any.some((c) => this._condicaoAtendida(c));
    if (requer.all) return requer.all.every((c) => this._condicaoAtendida(c));
    return this._condicaoAtendida(requer);
  }

  _calcularFinal() {
    const v = this.roteiro.variaveis;
    const profs = ["ana_lucia", "gabriel", "fabiana", "paula", "carol", "marcos"];
    const media = profs.reduce((s, id) => s + (this.roteiro.reputacao[id] ?? 50), 0) / profs.length;
    if (!v.passouCAI && !v.celularConfiscado && (v.sobrevivencia ?? 0) >= 20 && media >= 65) {
      return { id: "lenda", titulo: "Lenda do Campus", subtitulo: "Você domina os estudos e a política dos corredores.", detalhe: "Seu equilíbrio entre desempenho acadêmico, boas relações e leitura do ambiente fez de você uma referência no campus." };
    }
    if (!v.passouCAI && !v.celularConfiscado && v.estudouSimulado) {
      return { id: "raiz", titulo: "Estudante Raiz", subtitulo: "A seleção natural do vestibular não vai te pegar desprevenido.", detalhe: "Você encerrou o turno e já abriu espaço na agenda para estudar. Disciplina também é uma forma de sobrevivência." };
    }
    return { id: "sobrevivente", titulo: "Sobrevivente da CAI", subtitulo: "Você encarou o balcão mais temido e saiu com a cabeça erguida.", detalhe: "Com paciência — e talvez uma boa justificativa — você recuperou seu celular e atravessou o dia sem uma advertência grave." };
  }

  _entrarTelaFinal() {
    this.modoAuto = false;
    this.modoPular = false;
    this.finalDesbloqueado = this._calcularFinal();
    this.estado = Estado.FINAL;
    this.som.pararMusica();
  }

  _atualizarTelaFinal() {
    const m = this.entrada.mouse;
    if (this.entrada.cliqueNesteFrame) {
      if (m.x >= 190 && m.x <= 600 && m.y >= 570 && m.y <= 635) {
        this._reiniciar();
      } else if (m.x >= 650 && m.x <= 1060 && m.y >= 570 && m.y <= 635) {
        this.estado = Estado.CENAS_EXTRAS;
      }
    }
    if (this.entrada.apertou("Digit1") || this.entrada.apertou("Numpad1")) this._reiniciar();
    if (this.entrada.apertou("Digit2") || this.entrada.apertou("Numpad2")) this.estado = Estado.CENAS_EXTRAS;
  }

  _iniciarFala(cmd) {
    const tipo = cmd.cmd === "mensagem_celular" ? "celular"
      : cmd.cmd === "pensamento" ? "pensamento" : "fala";
    this.dialogo = { tipo, quem: cmd.quem ?? null, acao: cmd.acao ?? null, texto: cmd.texto, linhas: null };
    this.caracteres = 0;
    this.estado = Estado.DIALOGO;

    const pers = this.dados.personagens[cmd.quem];
    const nomeHist = tipo === "celular" ? "Celular (Grupo)"
      : tipo === "pensamento" ? `${pers?.nome || "Você"} (pensando)`
        : (pers?.nome || "Narrador");

    this.historico.push({
      quem: nomeHist,
      cor: pers?.cor ?? CONFIG.COR.giz,
      texto: cmd.texto,
    });
  }

  _entrarFimAto(cmd) {
    this.modoAuto = false;
    this.modoPular = false;
    this.fimAto = {
      titulo: cmd.titulo,
      proximo: cmd.proximo,
      proximoNo: cmd.proximoNo ?? null,
      proximoNumero: cmd.proximoNumero ?? null,
      proximoTitulo: cmd.proximoTitulo ?? null,
    };
    this.estado = Estado.FIM_ATO;
  }

  _iniciarProximoAto() {
    const fim = this.fimAto;
    if (!fim?.proximoNo || !(fim.proximoNo in this.dados.cena.nos)) {
      this._aviso("O próximo ato ainda não está disponível.");
      return;
    }
    this.som.pararMusica();
    this.roteiro.irPara(fim.proximoNo);
    this.sprites = {};
    this.dialogo = null;
    this.escolha = null;
    this.caracteres = 0;
    this.fimAto = null;
    this.introAtoNumero = fim.proximoNumero || "II";
    this.introAtoTitulo = fim.proximoTitulo || fim.proximo;
    this.introAtoTempo = 0;
    this.introAtoDuracao = 4.6;
    this.estado = Estado.INTRO_ATO;
  }

  // ---------- Geometria dos Botões de Escolha ----------

  _geometriaBotoes() {
    const { largura, altura, espaco } = CONFIG.BOTAO;
    const n = this.escolha.opcoes.length;
    const total = n * altura + (n - 1) * espaco;
    const topo = Math.max(95, (CONFIG.CAIXA.y - total) / 2 + 15);
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

    if ([Estado.MENU, Estado.INTRO_ATO, Estado.SLOTS, Estado.CREDITOS].includes(this.estado)) {
      desenharLousa(ctx);
    } else {
      this._desenharFundo();
      this._desenharSprites();
    }

    switch (this.estado) {
      case Estado.CARREGANDO:
        this._desenharCarregando();
        break;
      case Estado.MENU:
        this._desenharMenuPrincipal();
        break;
      case Estado.INTRO_ATO:
        desenharAberturaAto(ctx, this.introAtoNumero, this.introAtoTitulo, this.introAtoTempo, this.introAtoDuracao);
        break;
      case Estado.SLOTS:
        this._desenharSlots();
        break;
      case Estado.CREDITOS:
        this._desenharCreditos();
        break;
      case Estado.PAUSA:
        this._desenharPausa();
        break;
      case Estado.DIALOGO:
        this._desenharDialogo();
        this._desenharHudLimpo();
        break;
      case Estado.ESCOLHA:
        this._desenharEscolha();
        this._desenharHudLimpo();
        break;
      case Estado.HISTORICO:
        this._desenharDialogo();
        desenharModalHistorico(ctx, this.historico, this.scrollHistorico, (t, w, f) => this._quebrar(t, w, f));
        break;
      case Estado.REPUTACAO:
        this._desenharDialogo();
        desenharModalReputacao(ctx, this.roteiro.reputacao, this.dados.personagens);
        break;
      case Estado.INVENTARIO:
        this._desenharDialogo();
        desenharModalInventario(ctx, this.roteiro.inventario, this.itemInventarioSel, (t, w, f) => this._quebrar(t, w, f));
        break;
      case Estado.CONFIGURACOES:
        this._desenharDialogo();
        desenharModalConfiguracoes(ctx, this.velocidadeTexto);
        break;
      case Estado.FIM_ATO:
        desenharFimAtoEstilizado(ctx, this.fimAto, this.roteiro.variaveis, this.roteiro.reputacao, this.dados.personagens, this.ultimoTempo / 1000);
        break;
      case Estado.FINAL:
        desenharTelaFinal(ctx, this.finalDesbloqueado, this.roteiro.variaveis, this.roteiro.reputacao, this.ultimoTempo / 1000);
        break;
      case Estado.CENAS_EXTRAS:
        desenharCenasExtras(ctx);
        break;
      case Estado.ERRO:
        this._texto(this.mensagemErro, CONFIG.LARGURA / 2, CONFIG.ALTURA / 2, "center");
        break;
    }

    this._desenharAvisos();
  }

  _desenharHudLimpo() {
    // Barra de status discreta no topo (Risco CAI, Sobrevivência e Objetivo)
    desenharStatusCompacto(this.ctx, this.roteiro.variaveis, this.objetivos);

    // Barra inferior discreta de ações da Visual Novel
    this.botoesBarra = desenharBarraInferior(this.ctx, this.entrada.mouse, {
      auto: this.modoAuto,
      pular: this.modoPular,
      qtdItens: this.roteiro.inventario.length,
    });
  }

  _desenharFundo() {
    const { ctx } = this;
    const img = this.dados?.midia.fundos[this.fundoId];

    if (img) {
      ctx.drawImage(img, 0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
      return;
    }
    ctx.fillStyle = this.fundoId ? this._corDoId(this.fundoId, 35, 22) : CONFIG.COR.fundo;
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);
    if (this.fundoId) {
      ctx.font = CONFIG.FONTES.micro;
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.textAlign = "right";
      ctx.fillText(`Local: ${this.fundoId}`, CONFIG.LARGURA - 24, 34);
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
    desenharMenuInicial(this.ctx, this.menu, this.ultimoTempo / 1000);
    desenharCracha(this.ctx, 1000, -20, this.ultimoTempo / 1000);
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
    if (this.estadoAnteriorModal === Estado.ESCOLHA) this._desenharEscolha();
    else this._desenharDialogo();
    ctx.fillStyle = "rgba(0,0,0,0.72)";
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
    if (!this.dialogo) return;
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

    this._retArredondado(c.x, c.y, c.largura, c.altura, 12);
    ctx.fillStyle = CONFIG.COR.caixa;
    ctx.fill();
    ctx.strokeStyle = CONFIG.COR.borda;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (pers?.nome) {
      ctx.font = CONFIG.FONTES.nome;
      ctx.fillStyle = pers.cor;
      ctx.textAlign = "left";
      ctx.fillText(pers.nome, c.x + 28, c.y + 38);
      if (d.acao) {
        const w = ctx.measureText(pers.nome).width;
        ctx.font = CONFIG.FONTES.acao;
        ctx.fillStyle = CONFIG.COR.apagado;
        ctx.fillText(`(${d.acao})`, c.x + 28 + w + 14, c.y + 38);
      }
    }

    d.linhas ??= this._quebrar(d.texto, c.largura - 56, fonte);
    ctx.font = fonte;
    ctx.fillStyle = pensando ? CONFIG.COR.pensamento : CONFIG.COR.texto;
    this._textoRevelado(d.linhas, c.x + 28, c.y + (pers?.nome ? 76 : 48));

    if (this.caracteres >= d.texto.length) {
      this._indicadorContinuar(c.x + c.largura - 38, c.y + c.altura - 18);
    }
  }

  _desenharCelular() {
    const { ctx } = this;
    const d = this.dialogo;
    const x = 390, y = 95, w = 500, h = 300;

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

    if (this.dialogo && this.dialogo.tipo !== "celular") this._desenharCaixa();
    ctx.fillStyle = "rgba(0,0,0,0.58)";
    ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

    const botoes = this._geometriaBotoes();
    if (this.escolha.titulo) {
      ctx.font = CONFIG.FONTES.nome;
      ctx.fillStyle = CONFIG.COR.giz;
      ctx.textAlign = "center";
      ctx.fillText(this.escolha.titulo, CONFIG.LARGURA / 2, botoes[0].y - 20);
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
      for (const l of linhas) {
        ctx.fillText(l, b.x + 30, y);
        y += 30;
      }
    });

    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "center";
    ctx.fillText("Clique, use ↑ ↓ + Enter, ou digite o número", CONFIG.LARGURA / 2, c.y - 12);
  }

  _desenharAvisos() {
    const { ctx } = this;
    this.avisos.slice(-2).forEach((a, i) => {
      ctx.font = CONFIG.FONTES.pequena;
      const w = ctx.measureText(a.texto).width + 48;
      const x = (CONFIG.LARGURA - w) / 2;
      const y = 66 + i * 48;
      ctx.globalAlpha = Math.min(1, a.resta / 0.5);
      this._retArredondado(x, y, w, 38, 10);
      ctx.fillStyle = a.positivo ? CONFIG.COR.avisoVerde : CONFIG.COR.aviso;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(a.texto, CONFIG.LARGURA / 2, y + 25);
      ctx.globalAlpha = 1;
    });
  }

  _texto(str, x, y, alinhamento = "left") {
    this.ctx.font = CONFIG.FONTES.texto;
    this.ctx.fillStyle = CONFIG.COR.texto;
    this.ctx.textAlign = alinhamento;
    this.ctx.fillText(str, x, y);
  }

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

  _corDoId(id, sat, luz) {
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${h}, ${sat}%, ${luz}%)`;
  }
}