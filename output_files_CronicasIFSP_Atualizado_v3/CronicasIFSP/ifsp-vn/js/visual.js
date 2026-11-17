// VISUAL (desenho temático de lousa escolar, crachá e menus no canvas)

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

// Desenha o fundo estilo lousa escolar verde-escura com moldura sutil
export function desenharLousa(ctx) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;

  // Gradiente suave da lousa
  const grad = ctx.createRadialGradient(W * 0.45, H * 0.45, 80, W * 0.5, H * 0.5, W * 0.75);
  grad.addColorStop(0, "#193024");
  grad.addColorStop(1, CONFIG.COR.lousa);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Textura sutil de pó de giz / linhas de caderno pautado bem discretas
  ctx.save();
  ctx.strokeStyle = "rgba(241, 239, 230, 0.03)";
  ctx.lineWidth = 1;
  for (let y = 60; y < H; y += 36) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(W - 40, y);
    ctx.stroke();
  }

  // Moldura de madeira / alumínio da lousa
  ctx.strokeStyle = "#243b2f";
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  ctx.strokeStyle = "rgba(47, 158, 65, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  // Detalhe de apagador e giz no canto inferior direito da lousa
  ctx.fillStyle = "rgba(241, 239, 230, 0.12)";
  retArredondado(ctx, W - 190, H - 34, 65, 12, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(241, 239, 230, 0.35)";
  retArredondado(ctx, W - 110, H - 28, 32, 6, 3);
  ctx.fill();
  ctx.restore();
}

// Desenha o título principal estilizado em giz na lousa
export function desenharTituloJogo(ctx) {
  ctx.save();
  ctx.textAlign = "left";

  // Badge superior
  ctx.fillStyle = "rgba(47, 158, 65, 0.2)";
  retArredondado(ctx, 120, 110, 260, 34, 17);
  ctx.fill();
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = CONFIG.FONTES.pequena;
  ctx.fillStyle = "#6ee787";
  ctx.fillText("CAMPUS • VISUAL NOVEL", 140, 133);

  // Título principal com leve sombra de giz
  ctx.font = CONFIG.FONTES.titulo;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText(CONFIG.TITULO_JOGO, 124, 244);

  ctx.fillStyle = CONFIG.COR.giz;
  ctx.fillText(CONFIG.TITULO_JOGO, 120, 240);

  // Linha sublinhada estilo rabisco de giz verde
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(122, 262);
  ctx.lineTo(660, 262);
  ctx.stroke();

  // Subtítulo
  ctx.font = CONFIG.FONTES.nome;
  ctx.fillStyle = CONFIG.COR.apagado;
  ctx.fillText(CONFIG.SUBTITULO, 122, 310);

  ctx.restore();
}

// Desenha um título de seção (Créditos, Pausa, Jogos salvos)
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

// Desenha um crachá estudantil balançando suavemente no canto superior direito
export function desenharCracha(ctx, x, y, tempo) {
  ctx.save();
  const angulo = Math.sin(tempo * 1.6) * 0.04;
  ctx.translate(x, y);
  ctx.rotate(angulo);

  // Cordão verde do crachá
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(0, 135);
  ctx.lineTo(25, 0);
  ctx.stroke();

  // Clipe metálico
  ctx.fillStyle = "#9aa8a0";
  retArredondado(ctx, -14, 125, 28, 22, 4);
  ctx.fill();

  // Cartão do crachá
  const cw = 210;
  const ch = 300;
  const cx = -cw / 2;
  const cy = 144;

  // Sombra
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  retArredondado(ctx, cx + 8, cy + 10, cw, ch, 14);
  ctx.fill();

  // Corpo branco/off-white do crachá
  ctx.fillStyle = "#f4f6f4";
  retArredondado(ctx, cx, cy, cw, ch, 14);
  ctx.fill();

  // Faixa superior verde institucional IFSP
  ctx.save();
  retArredondado(ctx, cx, cy, cw, ch, 14);
  ctx.clip();
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.fillRect(cx, cy, cw, 56);

  // Cubos estilizados do logo (3x3 simplificado)
  ctx.fillStyle = "#ffffff";
  const bx = cx + 22;
  const by = cy + 14;
  const s = 8;
  const g = 3;
  // bolinha vermelha no topo esquerdo
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

  // Foto placeholder do aluno
  ctx.fillStyle = "#d8e2dc";
  retArredondado(ctx, cx + 55, cy + 76, 100, 110, 10);
  ctx.fill();
  ctx.strokeStyle = "#b7c7be";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Silhueta simples
  ctx.fillStyle = "#7f9488";
  ctx.beginPath();
  ctx.arc(0, cy + 115, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, cy + 178, 38, Math.PI, 0);
  ctx.fill();

  // Dados no crachá
  ctx.textAlign = "center";
  ctx.fillStyle = "#13241b";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("ESTUDANTE", 0, cy + 216);

  ctx.fillStyle = "#4a5d52";
  ctx.font = "14px sans-serif";
  ctx.fillText("Turno: Matutino", 0, cy + 240);

  // Código de barras decorativo
  ctx.fillStyle = "#13241b";
  for (let i = -65; i < 65; i += 6) {
    const wBar = (Math.abs(i) % 12 === 0) ? 3 : 1.5;
    ctx.fillRect(i, cy + 260, wBar, 22);
  }

  ctx.restore();
}

// Desenha os botões de qualquer menu (Principal, Pausa, Slots, Créditos)
export function desenharMenu(ctx, menu) {
  if (!menu) return;
  const botoes = menu.botoes();

  ctx.save();
  for (const b of botoes) {
    const sel = b.indice === menu.selecionado;

    // Fundo do botão
    retArredondado(ctx, b.x, b.y, b.w, b.h, 12);
    ctx.fillStyle = sel ? CONFIG.COR.botaoSel : CONFIG.COR.botao;
    ctx.fill();

    // Borda
    ctx.strokeStyle = sel ? CONFIG.COR.verde : "rgba(241, 239, 230, 0.22)";
    ctx.lineWidth = sel ? 3 : 1.5;
    ctx.stroke();

    // Indicador lateral verde quando selecionado
    if (sel) {
      ctx.fillStyle = CONFIG.COR.verde;
      retArredondado(ctx, b.x + 6, b.y + 10, 6, b.h - 20, 3);
      ctx.fill();
    }

    // Texto principal do botão
    ctx.textAlign = "left";
    ctx.font = CONFIG.FONTES.menu;
    ctx.fillStyle = sel ? "#ffffff" : CONFIG.COR.giz;

    if (b.item.detalhe) {
      // Layout de 2 linhas para slots de save
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

// Desenha a tela de Fim de Ato com estilo lousa e card caprichado
export function desenharFimAtoEstilizado(ctx, fimAto, variaveis, tempo) {
  const W = CONFIG.LARGURA;
  const H = CONFIG.ALTURA;
  const cx = W / 2;

  // Fundo escuro com gradiente de lousa acadêmica
  const grad = ctx.createRadialGradient(cx, H * 0.5, 100, cx, H * 0.5, W * 0.7);
  grad.addColorStop(0, "#13241b");
  grad.addColorStop(1, "#070d0d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Moldura decorativa sutil
  ctx.strokeStyle = "rgba(47, 158, 65, 0.3)";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Cartão central do Fim de Ato
  const cardW = 720;
  const cardH = 460;
  const cardX = (W - cardW) / 2;
  const cardY = (H - cardH) / 2 - 10;

  // Sombra do card
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  retArredondado(ctx, cardX + 10, cardY + 12, cardW, cardH, 20);
  ctx.fill();

  // Fundo do card
  ctx.fillStyle = "rgba(13, 27, 20, 0.95)";
  retArredondado(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();

  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Badge institucional superior dentro do card
  ctx.fillStyle = "rgba(47, 158, 65, 0.2)";
  retArredondado(ctx, cx - 110, cardY + 25, 220, 32, 16);
  ctx.fill();
  ctx.font = "bold 14px " + CONFIG.FONTES.pequena.split(' ').slice(1).join(' ');
  ctx.fillStyle = "#6ee787";
  ctx.textAlign = "center";
  ctx.fillText("AVALIAÇÃO DE ETAPA", cx, cardY + 46);

  // Título do Fim do Ato
  ctx.font = CONFIG.FONTES.titulo2;
  ctx.fillStyle = CONFIG.COR.giz;
  ctx.fillText(fimAto.titulo, cx, cardY + 120);

  // Linha divisória verde estilo giz
  ctx.strokeStyle = CONFIG.COR.verde;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, cardY + 145);
  ctx.lineTo(cardX + cardW - 60, cardY + 145);
  ctx.stroke();

  // Próximo ato
  if (fimAto.proximo) {
    ctx.font = CONFIG.FONTES.nome;
    ctx.fillStyle = CONFIG.COR.pensamento;
    ctx.fillText(`Próximo: ${fimAto.proximo}`, cx, cardY + 185);
  }

  // Resumo de Variáveis / Estatísticas em caixinhas organizadas
  const varsEntries = Object.entries(variaveis);
  const totalVars = varsEntries.length;
  const boxW = (cardW - 80 - (totalVars - 1) * 15) / totalVars;
  const boxH = 90;
  const boxY = cardY + 220;
  const startX = cardX + 40;

  varsEntries.forEach(([nome, valor], i) => {
    const bx = startX + i * (boxW + 15);

    // Fundo da caixinha de stat
    ctx.fillStyle = "rgba(20, 38, 29, 0.9)";
    retArredondado(ctx, bx, boxY, boxW, boxH, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 158, 65, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rótulo da variável
    ctx.font = "13px sans-serif";
    ctx.fillStyle = CONFIG.COR.apagado;
    ctx.textAlign = "center";
    ctx.fillText(nome.toUpperCase(), bx + boxW / 2, boxY + 26);

    // Valor da variável
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = CONFIG.COR.giz;
    const valStr = typeof valor === "boolean" ? (valor ? "Sim" : "Não") : String(valor);
    ctx.fillText(valStr, bx + boxW / 2, boxY + 62);
  });

  // Rodapé do card: instrução para continuar (com efeito de piscar suave)
  ctx.font = CONFIG.FONTES.menu;
  ctx.fillStyle = CONFIG.COR.verde;
  ctx.textAlign = "center";
  ctx.fillText("▶ Clique ou Pressione Espaço para Continuar", cx, cardY + cardH - 45);
  ctx.restore();
}