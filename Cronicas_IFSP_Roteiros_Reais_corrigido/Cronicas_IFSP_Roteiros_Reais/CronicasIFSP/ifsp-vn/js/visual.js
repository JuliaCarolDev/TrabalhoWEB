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
  ctx.fillText(numeroAto === "EXTRA" ? "EPISÓDIO EXTRA" : `ATO ${numeroAto || "I"}`, W / 2, 345 + deslocY);

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
  // Logo oficial do IFSP, usando a imagem de referência enviada.
  // A imagem fica em cache para não ser recriada a cada quadro da animação.
  if (!desenharTelaFinal.logoIFSP) {
    desenharTelaFinal.logoIFSP = new Image();
    desenharTelaFinal.logoIFSP.src = 'data:image/png;base64,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';
  }
  const logoIFSP = desenharTelaFinal.logoIFSP;
  const logoX = x + 20, logoY = y + 8, logoW = 41, logoH = 54;
  ctx.save();
  retArredondado(ctx, logoX, logoY, logoW, logoH, 3);
  ctx.clip();
  if (logoIFSP.complete && logoIFSP.naturalWidth > 0) {
    ctx.drawImage(logoIFSP, logoX, logoY, logoW, logoH);
  }
  ctx.restore();

  ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
  ctx.font = `700 19px 'DM Sans', sans-serif`;
  ctx.fillText('INSTITUTO FEDERAL DE SÃO PAULO', x + 78, y + 40);
  ctx.font = `11px 'DM Sans', sans-serif`; ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillText('MEMÓRIA DE UM DIA NO CAMPUS', x + 78, y + 56);
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
const PROFESSORES_EXTRAS = [
  { id: 'ana_lucia', nome: 'Profª Ana Lúcia', area: 'Filosofia', cor: '#b99bd8', inicial: 'A' },
  { id: 'fabiana', nome: 'Profª Fabiana', area: 'Literatura', cor: '#d99a45', inicial: 'F' },
  { id: 'marcos', nome: 'Prof. Marcos', area: 'Artes', cor: '#d8bd58', inicial: 'M' },
  { id: 'paula', nome: 'Profª Paula', area: 'Biologia', cor: '#78b9d9', inicial: 'P' },
  { id: 'gabriel', nome: 'Prof. Gabriel', area: 'História', cor: '#d9a34b', inicial: 'G' },
];

function desenharRetratoProfessor(ctx, x, y, tamanho, professor) {
  ctx.save();
  retArredondado(ctx, x, y, tamanho, tamanho, 8);
  ctx.fillStyle = professor.cor; ctx.fill();
  ctx.beginPath(); ctx.arc(x + tamanho / 2, y + tamanho * 0.38, tamanho * 0.19, 0, Math.PI * 2);
  ctx.fillStyle = '#f0d1b2'; ctx.fill();
  // Cabelo estilizado e silhueta de ombros: retrato ilustrado, sem depender de arquivos externos.
  ctx.beginPath();
  ctx.arc(x + tamanho / 2, y + tamanho * 0.34, tamanho * 0.22, Math.PI, Math.PI * 2);
  ctx.lineTo(x + tamanho * 0.73, y + tamanho * 0.43);
  ctx.quadraticCurveTo(x + tamanho / 2, y + tamanho * 0.53, x + tamanho * 0.27, y + tamanho * 0.43);
  ctx.closePath(); ctx.fillStyle = '#3a3029'; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + tamanho * 0.13, y + tamanho * 0.96);
  ctx.quadraticCurveTo(x + tamanho * 0.17, y + tamanho * 0.61, x + tamanho / 2, y + tamanho * 0.62);
  ctx.quadraticCurveTo(x + tamanho * 0.83, y + tamanho * 0.61, x + tamanho * 0.87, y + tamanho * 0.96);
  ctx.closePath(); ctx.fillStyle = '#263d30'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 ${Math.round(tamanho * 0.15)}px 'DM Sans', sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText(professor.inicial, x + tamanho / 2, y + tamanho * 0.91);
  ctx.restore();
}

function desenharCenarioCafe(ctx) {
  // Estante, janela e mesa da sala dos professores.
  ctx.fillStyle = '#d8d0b9'; ctx.fillRect(90, 125, 1100, 500);
  ctx.fillStyle = '#b9c9bd'; ctx.fillRect(135, 165, 260, 190);
  ctx.strokeStyle = '#f5f0df'; ctx.lineWidth = 9; ctx.strokeRect(135, 165, 260, 190);
  ctx.beginPath(); ctx.moveTo(265, 165); ctx.lineTo(265, 355); ctx.moveTo(135, 260); ctx.lineTo(395, 260); ctx.stroke();
  ctx.fillStyle = '#79583e'; ctx.fillRect(820, 155, 270, 175);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = ['#9b6049', '#526f59', '#d1a65a', '#6d7f9b', '#8e6a8d'][i];
    ctx.fillRect(840 + i * 48, 180, 35, 125);
  }
  ctx.fillStyle = '#76533b';
  retArredondado(ctx, 245, 440, 790, 105, 14); ctx.fill();
  ctx.fillStyle = '#9b7554'; retArredondado(ctx, 275, 450, 730, 18, 7); ctx.fill();
  // Cinco xícaras de café.
  for (let i = 0; i < 5; i++) {
    const cx = 330 + i * 145;
    ctx.fillStyle = '#f5f0e5'; retArredondado(ctx, cx, 405, 58, 42, 8); ctx.fill();
    ctx.strokeStyle = '#f5f0e5'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(cx + 61, 425, 12, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = '#6d432e'; ctx.beginPath(); ctx.ellipse(cx + 29, 411, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export function desenharCenasExtras(ctx, concluidas = [], secretaConcluida = false) {
  const W = CONFIG.LARGURA, H = CONFIG.ALTURA;
  desenharLousa(ctx);
  ctx.save();
  ctx.strokeStyle = 'rgba(222,232,220,0.18)'; ctx.strokeRect(42, 36, W - 84, H - 72);
  ctx.fillStyle = '#f1f0e7'; retArredondado(ctx, 95, 65, 1090, 615, 12); ctx.fill();
  ctx.save(); retArredondado(ctx, 95, 65, 1090, 615, 12); ctx.clip();
  ctx.fillStyle = '#238c42'; ctx.fillRect(95, 65, 1090, 68);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 20px 'DM Sans', sans-serif`;
  ctx.fillText('ARQUIVO DE CENAS EXTRAS', 130, 107);
  ctx.fillStyle = '#1b3023'; ctx.font = `700 34px 'Bebas Neue', sans-serif`;
  ctx.fillText('OS PROFESSORES TAMBÉM TÊM SUAS HISTÓRIAS', 135, 170);
  ctx.fillStyle = '#58685d'; ctx.font = `14px 'DM Sans', sans-serif`;
  ctx.fillText('Cinco episódios independentes. Cada escolha deixa sua marca na memória do campus.', 137, 197);

  const posicoes = [
    { x: 120, y: 220 }, { x: 485, y: 220 }, { x: 850, y: 220 },
    { x: 302, y: 402 }, { x: 667, y: 402 },
  ];
  PROFESSORES_EXTRAS.forEach((p, i) => {
    const { x, y } = posicoes[i];
    retArredondado(ctx, x, y, 310, 160, 9); ctx.fillStyle = '#e4eae2'; ctx.fill();
    ctx.strokeStyle = concluidas.includes(p.id) ? '#c79b32' : '#c8d2c8';
    ctx.lineWidth = concluidas.includes(p.id) ? 3 : 1.2; ctx.stroke();
    desenharRetratoProfessor(ctx, x + 13, y + 16, 88, p);
    ctx.textAlign = 'left'; ctx.fillStyle = '#1c3325'; ctx.font = `700 16px 'DM Sans', sans-serif`;
    ctx.fillText(p.nome, x + 114, y + 43);
    ctx.fillStyle = '#68786d'; ctx.font = `12px 'DM Sans', sans-serif`; ctx.fillText(p.area, x + 114, y + 66);
    ctx.fillStyle = '#2d8b45'; ctx.font = `700 10px 'DM Sans', sans-serif`; ctx.fillText(`EPISÓDIO 0${i + 1}`, x + 114, y + 91);
    if (concluidas.includes(p.id)) {
      retArredondado(ctx, x + 110, y + 111, 180, 30, 15); ctx.fillStyle = '#8c6b1d'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = `700 11px 'DM Sans', sans-serif`;
      ctx.fillText('★  CONCLUÍDO', x + 200, y + 131);
    } else {
      ctx.fillStyle = '#65766a'; ctx.textAlign = 'left'; ctx.font = `600 10px 'DM Sans', sans-serif`;
      ctx.fillText('CLIQUE PARA INICIAR', x + 114, y + 129);
    }
  });
  const todas = concluidas.length === 5;
  retArredondado(ctx, 370, 585, 540, 42, 8);
  ctx.fillStyle = todas ? '#1d5830' : '#dce3d9'; ctx.fill();
  ctx.textAlign = 'center'; ctx.font = `700 13px 'DM Sans', sans-serif`;
  ctx.fillStyle = todas ? '#fff' : '#78867b';
  ctx.fillText(secretaConcluida ? '★  EPISÓDIO SECRETO CONCLUÍDO — TROFÉU PLATINA' : todas ? '★  EPISÓDIO SECRETO DESBLOQUEADO — CAFÉ COM OS PROFESSORES' : `EPISÓDIO SECRETO  •  ${concluidas.length}/5 EPISÓDIOS CONCLUÍDOS`, 640, 611);
  retArredondado(ctx, 490, 638, 300, 34, 7); ctx.fillStyle = '#173d28'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `700 12px 'DM Sans', sans-serif`; ctx.fillText('VOLTAR AO MENU INICIAL', 640, 660);
  ctx.restore();
  ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(226,235,225,0.58)'; ctx.font = `11px 'DM Sans', sans-serif`;
  ctx.fillText('CLIQUE EM UM RETRATO PARA ABRIR O EPISÓDIO', W / 2, 700);
  ctx.restore();
}

export function desenharFinalCenaSecreta(ctx, concluida = true) {
  const W = CONFIG.LARGURA, H = CONFIG.ALTURA;
  desenharLousa(ctx);
  ctx.save();
  // Ilustração final em composição de fotografia coletiva, com margens seguras.
  ctx.fillStyle = '#d8d0b9'; retArredondado(ctx, 72, 48, 1136, 624, 14); ctx.fill();
  ctx.save(); retArredondado(ctx, 72, 48, 1136, 624, 14); ctx.clip();
  ctx.fillStyle = '#c7d5c9'; ctx.fillRect(100, 82, 1080, 370);
  ctx.fillStyle = '#a9bcae'; ctx.fillRect(125, 105, 245, 205);
  ctx.strokeStyle = '#f5f0df'; ctx.lineWidth = 8; ctx.strokeRect(125, 105, 245, 205);
  ctx.beginPath(); ctx.moveTo(247, 105); ctx.lineTo(247, 310); ctx.moveTo(125, 207); ctx.lineTo(370, 207); ctx.stroke();
  ctx.fillStyle = '#76533b'; retArredondado(ctx, 235, 408, 810, 115, 14); ctx.fill();
  const elenco = [
    { id: 'ana_lucia', nome: 'A. Lúcia', area: 'Filosofia', cor: '#b99bd8', inicial: 'A' },
    { id: 'fabiana', nome: 'Fabiana', area: 'Literatura', cor: '#d99a45', inicial: 'F' },
    { id: 'marcos', nome: 'Marcos', area: 'Artes', cor: '#d8bd58', inicial: 'M' },
    { id: 'paula', nome: 'Paula', area: 'Biologia', cor: '#78b9d9', inicial: 'P' },
    { id: 'gabriel', nome: 'Gabriel', area: 'História', cor: '#d9a34b', inicial: 'G' },
  ];
  elenco.forEach((p, i) => desenharRetratoProfessor(ctx, 175 + i * 190, 205 + (i % 2) * 12, 125, p));
  // Protagonista e visitantes aparecem na composição da selfie.
  const convidados = [
    { nome: 'Carol', cor: '#e4a5b8', inicial: 'C' },
    { nome: 'Você', cor: '#7aa9c7', inicial: '★' },
    { nome: 'Fábio', cor: '#d47d68', inicial: 'F' },
  ];
  convidados.forEach((p, i) => desenharRetratoProfessor(ctx, 380 + i * 175, 365, 112, p));
  // Xícaras e pote de biscoitos sobre a mesa.
  for (let i = 0; i < 4; i++) {
    const x = 330 + i * 180;
    ctx.fillStyle = '#f5f0e5'; retArredondado(ctx, x, 390, 48, 32, 6); ctx.fill();
    ctx.strokeStyle = '#f5f0e5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + 50, 406, 9, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = '#6d432e'; ctx.beginPath(); ctx.ellipse(x + 24, 395, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
  retArredondado(ctx, 845, 376, 70, 54, 8); ctx.fillStyle = '#d6b56d'; ctx.fill();
  ctx.fillStyle = '#fff0cf'; ctx.font = `700 12px 'DM Sans', sans-serif`; ctx.textAlign = 'center'; ctx.fillText('BISCOITOS', 880, 407);
  ctx.fillStyle = 'rgba(19,36,27,0.92)'; ctx.fillRect(72, 548, 1136, 124);
  ctx.fillStyle = '#e8c65a'; ctx.font = `700 14px 'DM Sans', sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('TROFÉU PLATINA DESBLOQUEADO', W / 2, 579);
  ctx.fillStyle = '#fff'; ctx.font = `700 30px 'Bebas Neue', sans-serif`;
  ctx.fillText('PATRIMÔNIO HISTÓRICO DO IFSP', W / 2, 615);
  ctx.fillStyle = '#dce8dc'; ctx.font = `13px 'DM Sans', sans-serif`;
  ctx.fillText('CAMPANHA 100% CONCLUÍDA  •  TODOS OS ATOS + 5 EPISÓDIOS + EPISÓDIO SECRETO', W / 2, 645);
  ctx.restore();
  ctx.fillStyle = '#f1efe6'; ctx.font = `700 12px 'DM Sans', sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('CLIQUE OU PRESSIONE ENTER PARA VOLTAR AO ARQUIVO', W / 2, 700);
  ctx.restore();
}
