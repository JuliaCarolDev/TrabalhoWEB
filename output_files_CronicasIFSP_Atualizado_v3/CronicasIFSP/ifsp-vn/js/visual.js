// VISUAL (lousa escolar, crachá, barra inferior discreta, painéis de Reputação/Inventário/Histórico e Boletim de Fim de Ato)

import { CONFIG } from "./config.js";

function retArredondado(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function desenharLousa(ctx) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;

  const grad = ctx.createRadialGradient(W * 0.45, H * 0.45, 80, W * 0.5, H * 0.5, W * 0.75);
  grad.addColorStop(0, "#193024");
  grad.addColorStop(1, CONFIG.COR.lousa);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.strokeStyle = "rgba(241, 239, 230, 0.03)";
  ctx.lineWidth = 1;
  for (let y = 60; y < H; y += 36) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(W - 40, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#243b2f";
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  ctx.strokeStyle = "rgba(47, 158, 65, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  ctx.fillStyle = "rgba(241, 239, 230, 0.12)";
  retArredondado(ctx, W - 190, H - 34, 65, 12, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(241, 239, 230, 0.35)";
  retArredondado(ctx, W - 110, H - 28, 32, 6, 3);
  ctx.fill();
  ctx.restore();
}

export function desenharTituloJogo(ctx) {
  ctx.save();
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(47, 158, 65, 0.2)";
  retArredondado(ctx, 120, 110, 260, 34, 17);
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.pequena;
  ctx.fillStyle = "#6ee787";
  ctx.fillText("CAMPUS • VISUAL NOVEL", 140, 133);

  ctx.font = CONFIG.FONTES.titulo;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText(CONFIG.TITULO_JOGO, 124, 244);

  ctx.fillStyle = CONFIG.COR.giz;
  ctx.fillText(CONFIG.TITULO_JOGO, 120, 240);

  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(122, 262);
  ctx.lineTo(660, 262);
  ctx.stroke();

  ctx.font = CONFIG.FONTES.nome;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.fillText(CONFIG.SUBTITULO, 122, 310);

  ctx.restore();
}

export function desenharTitulo(ctx, texto, x, y, alinhamento = "left") {
  ctx.save();
  ctx.font = CONFIG.FONTES.titulo2;
  ctx.textAlign = alinhamento;

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillText(texto, x + 3, y + 3);

  ctx.fillStyle = CONFIG.COR.giz;
  ctx.fillText(texto, x, y);
  ctx.restore();
}

export function desenharCracha(ctx, x, y, tempo) {
  ctx.save();
  const angulo = Math.sin(tempo * 1.6) * 0.04;
  ctx.translate(x, y);
  ctx.rotate(angulo);

  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(0, 135);
  ctx.lineTo(25, 0);
  ctx.stroke();

  ctx.fillStyle = "#9aa8a0";
  retArredondado(ctx, -14, 125, 28, 22, 4);
  ctx.fill();

  const cw = 210;
  const ch = 300;
  const cx = -cw / 2;
  const cy = 144;

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  retArredondado(ctx, cx + 8, cy + 10, cw, ch, 14);
  ctx.fill();

  ctx.fillStyle = "#f4f6f4";
  retArredondado(ctx, cx, cy, cw, ch, 14);
  ctx.fill();

  ctx.save();
  retArredondado(ctx, cx, cy, cw, ch, 14);
  ctx.clip();
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fillRect(cx, cy, cw, 56);

  const bx = cx + 22;
  const by = cy + 14;
  const s = 8;
  const g = 3;
  ctx.fillStyle = CONFIG.COR.vermelho;
  ctx.beginPath();
  ctx.arc(bx + s / 2, by + s / 2, s / 2 + 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(bx + s + g, by, s, s);
  ctx.fillRect(bx, by + s + g, s, s);
  ctx.fillRect(bx + s + g, by + s + g, s, s);
  ctx.fillRect(bx, by + 2 * (s + g), s, s);

  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.fillText("IFSP", bx + 32, cy + 35);
  ctx.restore();

  ctx.fillStyle = "#d8e2dc";
  retArredondado(ctx, cx + 55, cy + 76, 100, 110, 10);
  ctx.fill();
  ctx.strokeStyle = "#b7c7be";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#7f9488";
  ctx.beginPath();
  ctx.arc(0, cy + 115, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, cy + 178, 38, Math.PI, 0);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#13241b";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("ESTUDANTE", 0, cy + 216);

  ctx.fillStyle = "#4a5d52";
  ctx.font = "14px sans-serif";
  ctx.fillText("Turno: Matutino", 0, cy + 240);

  ctx.fillStyle = "#13241b";
  for (let i = -65; i < 65; i += 6) {
    const wBar = Math.abs(i) % 12 === 0 ? 3 : 1.5;
    ctx.fillRect(i, cy + 260, wBar, 22);
  }

  ctx.restore();
}

export function desenharMenu(ctx, menu) {
  if (!menu) return;
  const botoes = menu.botoes();

  ctx.save();
  for (const b of botoes) {
    const sel = b.indice === menu.selecionado;

    retArredondado(ctx, b.x, b.y, b.w, b.h, 12);
    ctx.fillStyle = sel ? CONFIG.COR.botaoSel : CONFIG.COR.botao;
    ctx.fill();

    ctx.strokeStyle = sel ? CONFIG.COR.verde : "rgba(241, 239, 230, 0.22)";
    ctx.lineWidth = sel ? 3 : 1.5;
    ctx.stroke();

    if (sel) {
      ctx.fillStyle = CONFIG.COR.verde;
      retArredondado(ctx, b.x + 6, b.y + 10, 6, b.h - 20, 3);
      ctx.fill();
    }

    ctx.textAlign = "left";
    ctx.font = CONFIG.FONTES.menu;
    ctx.fillStyle = sel ? "#ffffff" : CONFIG.COR.giz;

    if (b.item.detalhe) {
      ctx.fillText(b.item.texto, b.x + 26, b.y + 34);
      ctx.font = CONFIG.FONTES.pequena;
      ctx.fillStyle = b.item.vazio ? CONFIG.COR.apagado : "#8ce99a";
      ctx.fillText(b.item.detalhe, b.x + 26, b.y + 62);
    } else {
      const cy = b.y + b.h / 2 + 9;
      ctx.fillText((sel ? "▸ " : "  ") + b.item.texto, b.x + 22, cy);
    }
  }
  ctx.restore();
}

// ---------- NOVOS ELEMENTOS DE INTERFACE ----------

// Barra discreta superior com indicadores essenciais sem poluir a tela
export function desenharStatusCompacto(ctx, variaveis, objetivos) {
  ctx.save();
  const risco = variaveis.riscoCAI ?? 0;
  const sobrev = variaveis.sobrevivencia ?? 0;

  retArredondado(ctx, 20, 14, 410, 36, 18);
  ctx.fillStyle = "rgba(8, 20, 14, 0.72)";
  ctx.fill();
  ctx.strokeStyle = "rgba(241, 239, 230, 0.16)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.micro;
  ctx.textAlign = "left";

  // Risco CAI
  ctx.fillStyle = risco >= 50 ? "#ff6b6b" : "#f1efe6";
  ctx.fillText(`⚠️ Risco CAI: ${risco}%`, 38, 37);

  // Separador
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillText("|", 185, 37);

  // Sobrevivência
  ctx.fillStyle = "#6ee787";
  ctx.fillText(`🎓 Sobrevivência: ${sobrev}%`, 205, 37);

  // Objetivo atual discreto no canto superior direito
  if (objetivos && objetivos.length > 0) {
    const objAtual = objetivos[objetivos.length - 1];
    ctx.font = CONFIG.FONTES.micro;
    const wObj = Math.min(480, ctx.measureText(`📌 ${objAtual}`).width + 36);
    retArredondado(ctx, CONFIG.LARGURA - wObj - 20, 14, wObj, 36, 18);
    ctx.fillStyle = "rgba(8, 20, 14, 0.72)";
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 158, 65, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#b9d9f2";
    ctx.textAlign = "right";
    ctx.fillText(`📌 ${objAtual}`, CONFIG.LARGURA - 38, 37);
  }

  ctx.restore();
}

// Barra inferior discreta estilo Visual Novel
export function desenharBarraInferior(ctx, mouse, estadoFlags) {
  const itens = [
    { id: "historico", label: "📜 Histórico", ativo: false },
    { id: "pular", label: "⏩ Pular", ativo: estadoFlags.pular },
    { id: "auto", label: "▶ Automático", ativo: estadoFlags.auto },
    { id: "reputacao", label: "❤️ Reputação", ativo: false },
    { id: "inventario", label: `🎒 Inventário (${estadoFlags.qtdItens})`, ativo: false },
    { id: "salvar", label: "💾 Salvar", ativo: false },
    { id: "config", label: "⚙️ Config", ativo: false },
  ];

  const btnW = 148;
  const btnH = 34;
  const gap = 12;
  const totalW = itens.length * btnW + (itens.length - 1) * gap;
  const startX = (CONFIG.LARGURA - totalW) / 2;
  const y = 674;

  const geometria = [];

  ctx.save();
  // Fundo translúcido da barra
  retArredondado(ctx, startX - 14, y - 4, totalW + 28, btnH + 8, 12);
  ctx.fillStyle = "rgba(6, 15, 11, 0.78)";
  ctx.fill();
  ctx.strokeStyle = "rgba(241, 239, 230, 0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  itens.forEach((item, idx) => {
    const x = startX + idx * (btnW + gap);
    const hover = mouse.x >= x && mouse.x <= x + btnW && mouse.y >= y && mouse.y <= y + btnH;

    retArredondado(ctx, x, y, btnW, btnH, 8);
    if (item.ativo) {
      ctx.fillStyle = CONFIG.COR.verde;
    } else if (hover) {
      ctx.fillStyle = "rgba(47, 158, 65, 0.35)";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    }
    ctx.fill();

    ctx.font = CONFIG.FONTES.micro;
    ctx.fillStyle = item.ativo || hover ? "#ffffff" : "#cfd8d3";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x + btnW / 2, y + 22);

    geometria.push({ id: item.id, x, y, w: btnW, h: btnH });
  });

  ctx.restore();
  return geometria;
}

// Modal de Histórico de Diálogos
export function desenharModalHistorico(ctx, historico, scroll, quebrarFn) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

  const x = 200, y = 90, w = 880, h = 540;
  retArredondado(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#0f1f17";
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.titulo3;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.textAlign = "left";
  ctx.fillText("Histórico de Diálogos", x + 32, y + 44);

  // Botão Fechar
  retArredondado(ctx, x + w - 120, y + 20, 95, 34, 8);
  ctx.fillStyle = CONFIG.COR.vermelho;
  ctx.fill();
  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Fechar (Esc)", x + w - 72, y + 42);

  let py = y + 88;
  const visiveis = historico.slice(scroll, scroll + 6);

  if (visiveis.length === 0) {
    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "center";
    ctx.fillText("Nenhum diálogo registrado ainda.", x + w / 2, y + 260);
  } else {
    for (const hItem of visiveis) {
      ctx.textAlign = "left";
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = hItem.cor || CONFIG.COR.verde;
      ctx.fillText(hItem.quem, x + 32, py);

      ctx.font = "16px sans-serif";
      ctx.fillStyle = CONFIG.COR.texto;
      const linhas = quebrarFn(hItem.texto, w - 64, "16px sans-serif").slice(0, 2);
      linhas.forEach((l, li) => {
        ctx.fillText(l, x + 32, py + 22 + li * 20);
      });
      py += 72;
    }
  }

  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.textAlign = "center";
  ctx.fillText("Use ↑ ↓ ou clique na parte superior/inferior para rolar", x + w / 2, y + h - 18);
  ctx.restore();
}

// Modal de Reputação com Personagens
export function desenharModalReputacao(ctx, reputacao, personagens) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

  const x = 280, y = 110, w = 720, h = 500;
  retArredondado(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#0f1f17";
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.titulo3;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.textAlign = "left";
  ctx.fillText("Reputação no Campus", x + 32, y + 46);

  const entries = Object.entries(reputacao);
  let py = y + 95;

  for (const [id, valor] of entries) {
    const pers = personagens[id];
    const nome = pers?.nome || id;
    const cor = pers?.cor || CONFIG.COR.verde;

    // Classificação textual da afinidade
    let status = "Neutro";
    if (valor >= 80) status = "Aliado de Confiança";
    else if (valor >= 60) status = "Boa Impressão";
    else if (valor <= 25) status = "Na Mira / Hostil";
    else if (valor <= 40) status = "Desconfiado";

    retArredondado(ctx, x + 32, py, w - 64, 78, 12);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fill();

    ctx.textAlign = "left";
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = cor;
    ctx.fillText(nome, x + 52, py + 30);

    ctx.textAlign = "right";
    ctx.font = "16px sans-serif";
    ctx.fillStyle = CONFIG.COR.giz;
    ctx.fillText(`${status} (${valor}%)`, x + w - 52, py + 30);

    // Barra de reputação
    const barX = x + 52;
    const barY = py + 45;
    const barW = w - 104;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    retArredondado(ctx, barX, barY, barW, 14, 7);
    ctx.fill();

    ctx.fillStyle = valor >= 50 ? CONFIG.COR.verde : CONFIG.COR.vermelho;
    retArredondado(ctx, barX, barY, Math.max(12, barW * (valor / 100)), 14, 7);
    ctx.fill();

    py += 94;
  }

  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.textAlign = "center";
  ctx.fillText("Clique ou pressione Esc para voltar", x + w / 2, y + h - 22);
  ctx.restore();
}

// Modal de Inventário (Mochila do Aluno)
export function desenharModalInventario(ctx, inventario, selecionado, quebrarFn) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

  const x = 220, y = 110, w = 840, h = 500;
  retArredondado(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#0f1f17";
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.titulo3;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.textAlign = "left";
  ctx.fillText("Mochila do Estudante (Inventário)", x + 32, y + 46);

  // Botão Fechar
  retArredondado(ctx, x + w - 120, y + 18, 95, 34, 8);
  ctx.fillStyle = CONFIG.COR.vermelho;
  ctx.fill();
  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Fechar", x + w - 72, y + 40);

  if (!inventario || inventario.length === 0) {
    ctx.font = CONFIG.FONTES.pequena;
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "center";
    ctx.fillText("Sua mochila está vazia no momento.", x + w / 2, y + 250);
  } else {
    // Lista à esquerda
    inventario.forEach((item, i) => {
      const iy = y + 85 + i * 58;
      const sel = i === selecionado;
      retArredondado(ctx, x + 30, iy, 380, 48, 10);
      ctx.fillStyle = sel ? CONFIG.COR.botaoSel : "rgba(255,255,255,0.05)";
      ctx.fill();
      ctx.strokeStyle = sel ? CONFIG.COR.verde : "transparent";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "bold 17px sans-serif";
      ctx.fillStyle = CONFIG.COR.giz;
      ctx.fillText(`${item.icone || "📦"} ${item.nome}`, x + 46, iy + 30);

      ctx.textAlign = "right";
      ctx.font = "15px sans-serif";
      ctx.fillStyle = "#8ce99a";
      ctx.fillText(`x${item.qtd ?? 1}`, x + 392, iy + 30);
    });

    // Painel de detalhes à direita
    const atual = inventario[selecionado] || inventario[0];
    retArredondado(ctx, x + 435, y + 85, 375, 350, 12);
    ctx.fillStyle = "rgba(8, 18, 13, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 158, 65, 0.3)";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "48px sans-serif";
    ctx.fillText(atual.icone || "📦", x + 622, y + 165);

    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = CONFIG.COR.giz;
    ctx.fillText(atual.nome, x + 622, y + 210);

    ctx.textAlign = "left";
    ctx.font = "16px sans-serif";
    ctx.fillStyle = CONFIG.COR.apagado;
    const descLinhas = quebrarFn(atual.descricao || "", 330, "16px sans-serif");
    descLinhas.forEach((l, li) => {
      ctx.fillText(l, x + 458, y + 250 + li * 24);
    });
  }

  ctx.restore();
}

// Modal de Configurações
export function desenharModalConfiguracoes(ctx, velocidadeTexto) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, CONFIG.LARGURA, CONFIG.ALTURA);

  const x = 340, y = 130, w = 600, h = 440;
  retArredondado(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#0f1f17";
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.titulo3;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.textAlign = "center";
  ctx.fillText("Configurações", x + w / 2, y + 48);

  const linhas = [
    { label: "Volume da Música", valor: `${Math.round(CONFIG.VOLUME.musica * 100)}%`, y: 245 },
    { label: "Efeitos Sonoros", valor: `${Math.round(CONFIG.VOLUME.sfx * 100)}%`, y: 315 },
    { label: "Velocidade do Texto", valor: `${velocidadeTexto} c/s`, y: 385 },
  ];

  linhas.forEach((l) => {
    ctx.textAlign = "left";
    ctx.font = "18px sans-serif";
    ctx.fillStyle = CONFIG.COR.texto;
    ctx.fillText(l.label, x + 50, l.y + 26);

    // Botão -
    retArredondado(ctx, 620, l.y, 45, 38, 8);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("-", 642, l.y + 25);

    // Valor
    ctx.fillStyle = "#8ce99a";
    ctx.fillText(l.valor, 750, l.y + 25);

    // Botão +
    retArredondado(ctx, 835, l.y, 45, 38, 8);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("+", 857, l.y + 25);
  });

  // Botão Fechar
  retArredondado(ctx, 540, 490, 200, 48, 10);
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fill();
  ctx.font = "bold 18px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Aplicar e Voltar", 640, 520);

  ctx.restore();
}

// ---------- TELA DE FIM DE ATO CRIATIVA (BOLETIM / PRONTUÁRIO ACADÊMICO IFSP) ----------

export function desenharFimAtoEstilizado(ctx, fimAto, variaveis, reputacao, personagens, tempo) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;
  const cx = W / 2;

  // Fundo temático de lousa escolar
  desenharLousa(ctx);

  // Documento estilo Prontuário / Boletim Oficial do Campus
  const docW = 860;
  const docH = 560;
  const docX = (W - docW) / 2;
  const docY = (H - docH) / 2;

  // Sombra da folha
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  retArredondado(ctx, docX + 12, docY + 14, docW, docH, 16);
  ctx.fill();

  // Papel timbrado off-white
  ctx.fillStyle = "#f4f6f2";
  retArredondado(ctx, docX, docY, docW, docH, 16);
  ctx.fill();

  // Cabeçalho verde institucional IFSP
  ctx.save();
  retArredondado(ctx, docX, docY, docW, docH, 16);
  ctx.clip();
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fillRect(docX, docY, docW, 74);

  ctx.textAlign = "left";
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("INSTITUTO FEDERAL DE SÃO PAULO — RELATÓRIO DE ETAPA", docX + 34, docY + 45);
  ctx.restore();

  // Título do Ato concluído
  ctx.textAlign = "left";
  ctx.font = CONFIG.FONTES.titulo2;
  ctx.fillStyle = "#13241b";
  ctx.fillText(fimAto.titulo, docX + 36, docY + 135);

  if (fimAto.proximo) {
    ctx.font = "italic 19px sans-serif";
    ctx.fillStyle = "#2f6f44";
    ctx.fillText(`Próxima Etapa: ${fimAto.proximo}`, docX + 36, docY + 168);
  }

  // Carimbo acadêmico rotacionado no canto superior direito do boletim
  ctx.save();
  ctx.translate(docX + docW - 140, docY + 135);
  ctx.rotate(-0.14);
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 3;
  retArredondado(ctx, -95, -26, 190, 52, 8);
  ctx.stroke();
  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.textAlign = "center";
  ctx.fillText("ETAPA CONCLUÍDA", 0, 6);
  ctx.restore();

  // Linha separadora
  ctx.strokeStyle = "#cbd5ce";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(docX + 36, docY + 190);
  ctx.lineTo(docX + docW - 36, docY + 190);
  ctx.stroke();

  // Coluna Esquerda: Indicadores Acadêmicos
  ctx.textAlign = "left";
  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = "#243b2f";
  ctx.fillText("INDICADORES DO ESTUDANTE", docX + 36, docY + 225);

  const cards = [
    { nome: "Risco na CAI", valor: `${variaveis.riscoCAI ?? 0}%`, cor: "#d9342b" },
    { nome: "Sobrevivência", valor: `${variaveis.sobrevivencia ?? 0}%`, cor: "#2f9e41" },
    { nome: "Celular", valor: variaveis.celularConfiscado ? "Retido na CAI" : "Seguro", cor: "#1c7ed6" },
  ];

  cards.forEach((c, i) => {
    const cy = docY + 245 + i * 64;
    retArredondado(ctx, docX + 36, cy, 370, 52, 8);
    ctx.fillStyle = "#e6ece8";
    ctx.fill();

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#33473c";
    ctx.textAlign = "left";
    ctx.fillText(c.nome, docX + 52, cy + 32);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = c.cor;
    ctx.textAlign = "right";
    ctx.fillText(c.valor, docX + 390, cy + 32);
  });

  // Coluna Direita: Reputação com Personagens
  ctx.textAlign = "left";
  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = "#243b2f";
  ctx.fillText("VÍNCULOS NO CAMPUS", docX + 445, docY + 225);

  let ry = docY + 245;
  for (const [id, val] of Object.entries(reputacao ?? {})) {
    const nome = personagens?.[id]?.nome || id;
    retArredondado(ctx, docX + 445, ry, 375, 52, 8);
    ctx.fillStyle = "#e6ece8";
    ctx.fill();

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#33473c";
    ctx.textAlign = "left";
    ctx.fillText(nome, docX + 462, ry + 32);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = val >= 50 ? "#2f9e41" : "#d9342b";
    ctx.textAlign = "right";
    ctx.fillText(`${val}%`, docX + 802, ry + 32);

    ry += 64;
  }

  // Rodapé pulsante para voltar ao menu
  const alpha = 0.55 + Math.sin(tempo * 4) * 0.45;
  ctx.save();
  ctx.globalAlpha = alpha;
  retArredondado(ctx, cx - 220, docY + docH - 64, 440, 42, 10);
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fill();

  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("▶ Clique ou Pressione Espaço para Retornar ao Menu", cx, docY + docH - 37);
  ctx.restore();
}