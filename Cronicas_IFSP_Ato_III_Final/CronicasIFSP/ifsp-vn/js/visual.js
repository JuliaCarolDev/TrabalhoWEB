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

// Tela inicial autoral: referências discretas a cadernos, arquivos e rotina escolar.
export function desenharMenuInicial(ctx, menu, tempo = 0) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;
  ctx.save();

  // Textura editorial muito suave: papel pautado + margem de fichário.
  ctx.fillStyle = 'rgba(4, 13, 9, 0.12)';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(226, 235, 225, 0.035)';
  ctx.lineWidth = 1;
  for (let y = 82; y < H - 30; y += 44) {
    ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(W - 42, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(207, 91, 76, 0.20)';
  ctx.beginPath(); ctx.moveTo(78, 54); ctx.lineTo(78, H - 52); ctx.stroke();

  // Mancha gráfica de papel sobreposto no canto inferior direito.
  ctx.save();
  ctx.translate(1110, 590);
  ctx.rotate(-0.075);
  ctx.fillStyle = 'rgba(226, 232, 220, 0.045)';
  ctx.fillRect(-128, -68, 220, 112);
  ctx.strokeStyle = 'rgba(226, 232, 220, 0.13)';
  ctx.setLineDash([5, 7]);
  ctx.strokeRect(-128, -68, 220, 112);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(226, 232, 220, 0.30)';
  ctx.font = `12px ${"'DM Sans', sans-serif"}`;
  ctx.textAlign = 'left';
  ctx.fillText('ANOTAÇÕES DE CAMPUS', -110, -43);
  ctx.strokeStyle = 'rgba(226, 232, 220, 0.12)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(-110, -20 + i * 19); ctx.lineTo(65, -20 + i * 19); ctx.stroke();
  }
  ctx.restore();

  // Pequeno desenho linear de um bloco escolar, quase como rabisco de margem.
  ctx.save();
  ctx.globalAlpha = 0.17;
  ctx.translate(900, 570);
  ctx.strokeStyle = '#b9c9bb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-70, 0); ctx.lineTo(-70, -76); ctx.lineTo(0, -110); ctx.lineTo(70, -76); ctx.lineTo(70, 0);
  ctx.moveTo(-88, 0); ctx.lineTo(88, 0);
  ctx.moveTo(-45, -62); ctx.lineTo(-45, -28); ctx.moveTo(-12, -62); ctx.lineTo(-12, -28);
  ctx.moveTo(22, -62); ctx.lineTo(22, -28); ctx.moveTo(45, -62); ctx.lineTo(45, -28);
  ctx.stroke();
  ctx.restore();

  // Etiqueta superior.
  retArredondado(ctx, 112, 92, 258, 34, 17);
  ctx.fillStyle = 'rgba(47, 158, 65, 0.14)'; ctx.fill();
  ctx.strokeStyle = 'rgba(110, 231, 135, 0.58)'; ctx.lineWidth = 1.3; ctx.stroke();
  ctx.fillStyle = '#8ee6a0'; ctx.textAlign = 'center';
  ctx.font = `600 14px 'DM Sans', sans-serif`;
  ctx.fillText('UM ARQUIVO DE HISTÓRIAS DO CAMPUS', 241, 114);

  // Título com tipografia condensada e uma pequena marca de edição.
  ctx.textAlign = 'left';
  ctx.font = CONFIG.FONTES.titulo;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillText('CRÔNICAS DO IFSP', 110, 250);
  ctx.fillStyle = '#f0eee4';
  ctx.fillText('CRÔNICAS DO IFSP', 106, 246);
  ctx.fillStyle = '#4bbd62';
  ctx.fillRect(112, 266, 520, 4);
  ctx.fillStyle = 'rgba(240, 238, 228, 0.72)';
  ctx.font = `500 21px 'DM Sans', sans-serif`;
  ctx.fillText('Pequenas histórias, grandes dias no campus.', 114, 309);

  // Carimbo editorial discreto, oposto ao crachá.
  ctx.save();
  ctx.translate(700, 205);
  ctx.rotate(-0.055);
  ctx.strokeStyle = 'rgba(229, 235, 224, 0.22)';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(-2, -19, 118, 38);
  ctx.fillStyle = 'rgba(229, 235, 224, 0.42)';
  ctx.font = `700 11px 'DM Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('EDIÇÃO  •  01', 57, 4);
  ctx.restore();

  // Botões como fichas de arquivo: número, título e seta desenhada.
  if (menu) {
    for (const b of menu.botoes()) {
      const sel = b.indice === menu.selecionado;
      const y = b.y;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = sel ? 15 : 7;
      ctx.shadowOffsetY = 4;
      retArredondado(ctx, b.x, y, b.w, b.h, 7);
      ctx.fillStyle = sel ? '#1e5630' : 'rgba(7, 19, 13, 0.78)';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = sel ? '#59c56b' : 'rgba(220, 232, 220, 0.22)';
      ctx.lineWidth = sel ? 2 : 1;
      ctx.stroke();

      // Índice em uma pequena etiqueta lateral.
      ctx.fillStyle = sel ? '#53bd66' : 'rgba(220, 232, 220, 0.10)';
      retArredondado(ctx, b.x + 12, y + 11, 42, b.h - 22, 4); ctx.fill();
      ctx.textAlign = 'center';
      ctx.fillStyle = sel ? '#092013' : '#aab9ad';
      ctx.font = `700 14px 'DM Sans', sans-serif`;
      ctx.fillText(String(b.indice + 1).padStart(2, '0'), b.x + 33, y + 37);

      ctx.textAlign = 'left';
      ctx.fillStyle = sel ? '#fffdf4' : '#e3e8df';
      ctx.font = `700 21px 'DM Sans', sans-serif`;
      ctx.fillText(b.item.texto, b.x + 74, y + 39);

      // Seta de navegação minimalista.
      ctx.strokeStyle = sel ? '#b9f0c1' : 'rgba(220, 232, 220, 0.48)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x + b.w - 42, y + 31);
      ctx.lineTo(b.x + b.w - 25, y + 31);
      ctx.moveTo(b.x + b.w - 33, y + 23);
      ctx.lineTo(b.x + b.w - 25, y + 31);
      ctx.lineTo(b.x + b.w - 33, y + 39);
      ctx.stroke();
      if (sel) {
        ctx.fillStyle = 'rgba(110, 231, 135, 0.12)';
        retArredondado(ctx, b.x + b.w - 62, y + 8, 48, b.h - 16, 4); ctx.fill();
      }
      ctx.restore();
    }
  }

  // Rodapé com instrução e pequenos marcadores de página.
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(226, 235, 225, 0.58)';
  ctx.font = `14px 'DM Sans', sans-serif`;
  ctx.fillText('MOUSE  •  SETAS  •  ENTER', 112, 674);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(226, 235, 225, 0.35)';
  ctx.font = `12px 'DM Sans', sans-serif`;
  ctx.fillText('CRÔNICAS DO IFSP     /     VISUAL NOVEL', 1168, 674);
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

  const x = 280, y = 75, w = 720, h = 570;
  retArredondado(ctx, x, y, w, h, 16);
  ctx.fillStyle = "#0f1f17";
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.titulo3;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.textAlign = "left";
  ctx.fillText("Reputação no Campus", x + 32, y + 40);

  const entries = Object.entries(reputacao);
  let py = y + 65;

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

    retArredondado(ctx, x + 24, py, w - 48, 56, 10);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fill();

    ctx.textAlign = "left";
    ctx.font = "bold 17px sans-serif";
    ctx.fillStyle = cor;
    ctx.fillText(nome, x + 40, py + 22);

    ctx.textAlign = "right";
    ctx.font = "14px sans-serif";
    ctx.fillStyle = CONFIG.COR.giz;
    ctx.fillText(`${status} (${valor}%)`, x + w - 40, py + 22);

    // Barra de reputação compacta
    const barX = x + 40;
    const barY = py + 32;
    const barW = w - 80;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    retArredondado(ctx, barX, barY, barW, 10, 5);
    ctx.fill();

    ctx.fillStyle = valor >= 50 ? CONFIG.COR.verde : CONFIG.COR.vermelho;
    retArredondado(ctx, barX, barY, Math.max(10, barW * (valor / 100)), 10, 5);
    ctx.fill();

    py += 64;
  }

  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.textAlign = "center";
  ctx.fillText("Clique ou pressione Esc para voltar", x + w / 2, y + h - 18);
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

  // Coluna Direita: vínculos mais relevantes (até cinco, para caber no relatório).
  ctx.textAlign = "left";
  ctx.font = "bold 17px sans-serif";
  ctx.fillStyle = "#243b2f";
  ctx.fillText("VÍNCULOS NO CAMPUS", docX + 445, docY + 225);

  let ry = docY + 245;
  const vinculos = Object.entries(reputacao ?? {}).slice(0, 7);
  for (const [id, val] of vinculos) {
    const nome = personagens?.[id]?.nome || id;
    retArredondado(ctx, docX + 445, ry, 375, 30, 6);
    ctx.fillStyle = "#e6ece8";
    ctx.fill();

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#33473c";
    ctx.textAlign = "left";
    ctx.fillText(nome, docX + 458, ry + 20);

    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = val >= 50 ? "#2f9e41" : "#d9342b";
    ctx.textAlign = "right";
    ctx.fillText(`${val}%`, docX + 802, ry + 20);

    ry += 33;
  }

  // Indicador de continuação muda conforme exista um próximo ato implementado.
  const alpha = 0.55 + Math.sin(tempo * 4) * 0.45;
  ctx.save();
  ctx.globalAlpha = alpha;
  retArredondado(ctx, cx - 270, docY + docH - 64, 540, 42, 10);
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fill();

  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  const acao = fimAto.proximoNo ? `▶ Continuar para ${fimAto.proximoNumero ? `o Ato ${fimAto.proximoNumero}` : "o próximo ato"}` : "▶ Clique ou pressione Espaço para retornar ao menu";
  ctx.fillText(acao, cx, docY + docH - 37);
  ctx.restore();
}

// ---------- ABERTURA CINEMATOGRÁFICA DE ATO ----------
// Sequência curta em estilo de arquivo acadêmico; pode ser pulada pelo jogador.
export function desenharAberturaAto(ctx, numeroAto, subtitulo, tempo, duracao = 4.6) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;
  const progresso = Math.max(0, Math.min(1, tempo / duracao));
  const entrada = Math.min(1, tempo / 0.85);
  const saida = tempo > duracao - 0.65 ? Math.max(0, (duracao - tempo) / 0.65) : 1;
  const suavizar = (v) => 1 - Math.pow(1 - v, 3);
  const alpha = suavizar(entrada) * saida;
  const pulso = 0.5 + Math.sin(tempo * 2.2) * 0.08;

  desenharLousa(ctx);
  ctx.save();
  ctx.globalAlpha = alpha;

  // Vinheta discreta e marcas de registro nas margens.
  const vinheta = ctx.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 760);
  vinheta.addColorStop(0, "rgba(0,0,0,0)");
  vinheta.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(241,239,230,0.18)";
  ctx.lineWidth = 1;
  ctx.strokeRect(72, 58, W - 144, H - 116);

  // Pequenos detalhes de ficha/arquivo nos cantos.
  ctx.fillStyle = "rgba(47,158,65,0.22)";
  ctx.fillRect(104, 100, 7, 7);
  ctx.fillRect(W - 111, H - 107, 7, 7);
  ctx.fillStyle = "rgba(241,239,230,0.48)";
  ctx.font = CONFIG.FONTES.micro;
  ctx.textAlign = "left";
  ctx.fillText("ARQUIVO • VIDA NO CAMPUS", 126, 107);
  ctx.textAlign = "right";
  ctx.fillText("IFSP / REGISTRO 001", W - 126, H - 100);

  // Linha que se desenha antes do título.
  const linhaW = 440 * Math.min(1, Math.max(0, (tempo - 0.35) / 0.9));
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo((W - linhaW) / 2, 265);
  ctx.lineTo((W + linhaW) / 2, 265);
  ctx.stroke();

  // Carimbo editorial levemente inclinado.
  ctx.save();
  ctx.translate(W / 2 + 300, 300);
  ctx.rotate(-0.11);
  ctx.strokeStyle = `rgba(91,190,105,${0.45 * alpha})`;
  ctx.lineWidth = 2;
  retArredondado(ctx, -82, -22, 164, 44, 5);
  ctx.stroke();
  ctx.fillStyle = `rgba(120,210,130,${0.8 * alpha})`;
  ctx.font = `bold 15px ${"'DM Sans', sans-serif"}`;
  ctx.textAlign = "center";
  ctx.fillText("NOVO REGISTRO", 0, 5);
  ctx.restore();

  // Título do ato com leve subida e revelação progressiva.
  const deslocY = (1 - suavizar(entrada)) * 22;
  ctx.textAlign = "center";
  ctx.font = CONFIG.FONTES.titulo2;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.globalAlpha = alpha * Math.min(1, Math.max(0, (tempo - 0.45) / 0.65));
  ctx.fillText(`ATO ${numeroAto || "I"}`, W / 2, 345 + deslocY);

  ctx.globalAlpha = alpha * Math.min(1, Math.max(0, (tempo - 1.0) / 0.85));
  ctx.font = `600 27px 'DM Sans', sans-serif`;
  ctx.fillStyle = "#d9e5da";
  ctx.fillText(subtitulo || "O começo de tudo", W / 2, 397 + deslocY);

  ctx.globalAlpha = alpha * (0.55 + pulso * 0.45);
  ctx.font = CONFIG.FONTES.pequena;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.fillText("Toda história começa em algum lugar.", W / 2, 455);

  // Barra de progresso fina e indicação de pular.
  ctx.globalAlpha = alpha * 0.5;
  ctx.fillStyle = "rgba(241,239,230,0.16)";
  retArredondado(ctx, W / 2 - 180, 565, 360, 3, 2);
  ctx.fill();
  ctx.fillStyle = CONFIG.COR.verde;
  retArredondado(ctx, W / 2 - 180, 565, 360 * progresso, 3, 2);
  ctx.fill();

  ctx.globalAlpha = alpha * (0.45 + pulso * 0.45);
  ctx.font = CONFIG.FONTES.micro;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.fillText("CLIQUE OU PRESSIONE ENTER PARA PULAR", W / 2, 620);
  ctx.restore();
}

// ---------- TELA FINAL / DESFECHO DA JORNADA ----------
export function desenharTelaFinal(ctx, final, variaveis = {}, reputacao = {}, tempo = 0) {
  const W = CONFIG.LARGURA, H = CONFIG.ALTURA;
  desenharLousa(ctx);
  ctx.save();

  // Moldura editorial e marcas de arquivo.
  ctx.strokeStyle = 'rgba(222,232,220,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 36, W - 84, H - 72);
  ctx.fillStyle = 'rgba(76,190,98,0.10)';
  ctx.fillRect(42, 36, 8, H - 72);
  ctx.textAlign = 'left';
  ctx.font = `12px 'DM Sans', sans-serif`;
  ctx.fillStyle = 'rgba(229,237,226,0.58)';
  ctx.fillText('CRÔNICAS DO IFSP  /  ARQUIVO DE CONCLUSÃO', 78, 75);
  ctx.textAlign = 'right';
  ctx.fillText('REGISTRO 003  •  FIM DO TURNO', W - 78, 75);

  // Folha central em papel, levemente deslocada para dar profundidade.
  const x = 190, y = 105, w = 900, h = 520;
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  retArredondado(ctx, x + 12, y + 14, w, h, 12); ctx.fill();
  ctx.fillStyle = '#f1f0e7';
  retArredondado(ctx, x, y, w, h, 12); ctx.fill();

  ctx.save();
  retArredondado(ctx, x, y, w, h, 12); ctx.clip();
  ctx.fillStyle = '#238c42'; ctx.fillRect(x, y, w, 70);
  // Ícone institucional abstrato.
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 28, y + 22, 10, 10); ctx.fillRect(x + 42, y + 22, 10, 10);
  ctx.fillRect(x + 28, y + 36, 10, 10); ctx.fillRect(x + 42, y + 36, 10, 10);
  ctx.fillStyle = '#e34b3e'; ctx.beginPath(); ctx.arc(x + 33, y + 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
  ctx.font = `700 19px 'DM Sans', sans-serif`;
  ctx.fillText('INSTITUTO FEDERAL DE SÃO PAULO', x + 72, y + 43);
  ctx.font = `11px 'DM Sans', sans-serif`; ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText('MEMÓRIA DE UM DIA NO CAMPUS', x + 72, y + 58);
  ctx.restore();

  // Carimbo de encerramento.
  ctx.save();
  ctx.translate(x + w - 125, y + 128); ctx.rotate(-0.12);
  ctx.strokeStyle = '#2b8e48'; ctx.lineWidth = 3;
  retArredondado(ctx, -95, -25, 190, 50, 5); ctx.stroke();
  ctx.fillStyle = '#2b8e48'; ctx.textAlign = 'center';
  ctx.font = `700 15px 'DM Sans', sans-serif`; ctx.fillText('DIA CONCLUÍDO', 0, 5);
  ctx.restore();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#53665a'; ctx.font = `12px 'DM Sans', sans-serif`;
  ctx.fillText('RELATÓRIO DE EXPERIÊNCIA  •  SEGUNDA-FEIRA', x + 42, y + 112);
  ctx.fillStyle = '#172c20'; ctx.font = `700 37px 'Bebas Neue', sans-serif`;
  ctx.fillText(final?.titulo || 'Jornada concluída', x + 42, y + 165);
  ctx.fillStyle = '#2d7b42'; ctx.font = `600 19px 'DM Sans', sans-serif`;
  ctx.fillText(final?.subtitulo || 'Mais um dia no campus chegou ao fim.', x + 42, y + 202);

  // Texto de desfecho com largura controlada.
  ctx.fillStyle = '#405247'; ctx.font = `16px 'DM Sans', sans-serif`;
  const texto = final?.detalhe || 'Cada escolha ajudou a escrever esta história.';
  const palavras = texto.split(' '); let linha = '', linhas = [];
  for (const palavra of palavras) {
    const teste = linha ? `${linha} ${palavra}` : palavra;
    if (ctx.measureText(teste).width > 570 && linha) { linhas.push(linha); linha = palavra; }
    else linha = teste;
  }
  if (linha) linhas.push(linha);
  linhas.slice(0, 3).forEach((l, i) => ctx.fillText(l, x + 42, y + 240 + i * 24));

  // Resumo de indicadores em pequenas etiquetas.
  const stats = [
    ['SOBREVIVÊNCIA', `${variaveis.sobrevivencia ?? 0}%`],
    ['RISCO CAI', `${variaveis.riscoCAI ?? 0}%`],
    ['VÍNCULO COM FÁBIO', `${reputacao.fabio ?? 50}%`],
  ];
  stats.forEach((s, i) => {
    const sx = x + 42 + i * 205, sy = y + 330;
    retArredondado(ctx, sx, sy, 185, 62, 6);
    ctx.fillStyle = '#e2e9e1'; ctx.fill();
    ctx.fillStyle = '#617267'; ctx.font = `700 10px 'DM Sans', sans-serif`; ctx.textAlign = 'left';
    ctx.fillText(s[0], sx + 12, sy + 21);
    ctx.fillStyle = '#1f6334'; ctx.font = `700 21px 'DM Sans', sans-serif`;
    ctx.fillText(s[1], sx + 12, sy + 47);
  });

  // Linha manuscrita e pequena nota de rodapé.
  ctx.strokeStyle = 'rgba(43,142,72,0.35)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + 42, y + 415); ctx.lineTo(x + w - 42, y + 415); ctx.stroke();
  ctx.fillStyle = '#68796d'; ctx.font = `italic 14px 'DM Sans', sans-serif`; ctx.textAlign = 'left';
  ctx.fillText('“Toda rotina guarda uma história que merece ser contada.”', x + 42, y + 445);

  // Botões finais com estética de fichas de arquivo.
  const pulse = 0.94 + Math.sin(tempo * 2.5) * 0.035;
  const buttons = [
    { x: 245, y: 570, w: 375, h: 58, label: 'VOLTAR PARA A TELA INICIAL', num: '01', fill: '#153b27' },
    { x: 660, y: 570, w: 375, h: 58, label: 'IR PARA CENAS EXTRAS', num: '02', fill: '#246c39' },
  ];
  buttons.forEach((b) => {
    ctx.save(); ctx.translate(b.x + b.w / 2, b.y + b.h / 2); ctx.scale(pulse, pulse); ctx.translate(-(b.x + b.w / 2), -(b.y + b.h / 2));
    retArredondado(ctx, b.x, b.y, b.w, b.h, 7); ctx.fillStyle = b.fill; ctx.fill();
    ctx.strokeStyle = 'rgba(35,140,66,0.65)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.16)'; retArredondado(ctx, b.x + 10, b.y + 9, 42, 40, 4); ctx.fill();
    ctx.fillStyle = '#d7e8d9'; ctx.font = `700 13px 'DM Sans', sans-serif`; ctx.textAlign = 'center'; ctx.fillText(b.num, b.x + 31, b.y + 34);
    ctx.fillStyle = '#fff'; ctx.font = `700 15px 'DM Sans', sans-serif`; ctx.textAlign = 'center'; ctx.fillText(b.label, b.x + b.w / 2 + 15, b.y + 35);
    ctx.restore();
  });
  ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(226,235,225,0.55)'; ctx.font = `11px 'DM Sans', sans-serif`;
  ctx.fillText('MOUSE  •  TECLAS 1 E 2', W / 2, 665);
  ctx.restore();
}

// ---------- HUB DE CENAS EXTRAS ----------
export function desenharCenasExtras(ctx) {
  const W = CONFIG.LARGURA, H = CONFIG.ALTURA;
  desenharLousa(ctx);
  ctx.save();
  ctx.strokeStyle = 'rgba(222,232,220,0.18)'; ctx.strokeRect(42, 36, W - 84, H - 72);
  const x = 230, y = 105, w = 820, h = 500;
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; retArredondado(ctx, x + 10, y + 12, w, h, 12); ctx.fill();
  ctx.fillStyle = '#f1f0e7'; retArredondado(ctx, x, y, w, h, 12); ctx.fill();
  ctx.fillStyle = '#238c42'; ctx.fillRect(x, y, w, 68);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 20px 'DM Sans', sans-serif`;
  ctx.fillText('ARQUIVO DE CENAS EXTRAS', x + 34, y + 42);
  ctx.fillStyle = '#1b3023'; ctx.font = `700 38px 'Bebas Neue', sans-serif`;
  ctx.fillText('O CAMPUS AINDA TEM HISTÓRIAS', x + 42, y + 145);
  ctx.fillStyle = '#506257'; ctx.font = `17px 'DM Sans', sans-serif`;
  ctx.fillText('Este espaço está reservado para momentos que acontecem', x + 42, y + 190);
  ctx.fillText('fora da linha principal da narrativa.', x + 42, y + 218);

  // Cartões de arquivo em preparação.
  const cards = [
    ['01', 'BASTIDORES DOS PROFESSORES', 'Pequenos recortes da sala dos docentes'],
    ['02', 'VIDA NO CAMPUS', 'Cenas cotidianas e encontros inesperados'],
    ['03', 'ROTAS ALTERNATIVAS', 'Outras consequências para suas escolhas'],
  ];
  cards.forEach((c, i) => {
    const cx = x + 42 + i * 244, cy = y + 270;
    retArredondado(ctx, cx, cy, 220, 112, 7); ctx.fillStyle = '#e3e9e2'; ctx.fill();
    ctx.fillStyle = '#2d8b45'; ctx.font = `700 12px 'DM Sans', sans-serif`; ctx.fillText(c[0], cx + 14, cy + 24);
    ctx.fillStyle = '#1d3325'; ctx.font = `700 12px 'DM Sans', sans-serif`; ctx.fillText(c[1], cx + 14, cy + 51);
    ctx.fillStyle = '#617267'; ctx.font = `11px 'DM Sans', sans-serif`; ctx.fillText(c[2], cx + 14, cy + 76);
    ctx.fillStyle = '#a2afa4'; ctx.font = `700 9px 'DM Sans', sans-serif`; ctx.fillText('EM PREPARAÇÃO', cx + 14, cy + 98);
  });
  retArredondado(ctx, W / 2 - 150, 555, 300, 54, 7); ctx.fillStyle = '#1d5830'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 15px 'DM Sans', sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('VOLTAR AO MENU INICIAL', W / 2, 588);
  ctx.fillStyle = 'rgba(226,235,225,0.6)'; ctx.font = `12px 'DM Sans', sans-serif`;
  ctx.fillText('CLIQUE, ENTER OU ESC PARA VOLTAR', W / 2, 645);
  ctx.restore();
}
