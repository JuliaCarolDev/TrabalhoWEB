// CARREGADOR
//
// 1) Lê os três JSONs ao mesmo tempo (Promise.all).
// 2) Pré-carrega as imagens e os áudios listados no assets.json.
//
// Arquivo ausente NÃO derruba o jogo: o recurso fica como null e o jogo
// desenha um placeholder no lugar. Os caminhos ausentes vão para
// midia.ausentes (aparecem no console e na tela de título).

import { CONFIG } from "./config.js";

async function lerJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`${url} → HTTP ${resposta.status}`);
  return resposta.json();
}

function carregarImagem(url) {
  return new Promise((resolver) => {
    const img = new Image();
    img.onload = () => resolver(img);
    img.onerror = () => resolver(null);
    img.src = url;
  });
}

function carregarAudio(url) {
  return new Promise((resolver) => {
    const audio = new Audio();
    let terminou = false;
    const fim = (ok) => {
      if (terminou) return;
      terminou = true;
      clearTimeout(limite);
      resolver(ok ? audio : null);
    };
    audio.addEventListener("canplaythrough", () => fim(true), { once: true });
    audio.addEventListener("error", () => fim(false), { once: true });
    // Se demorar demais (arquivo grande), segue em frente; ele continua baixando.
    const limite = setTimeout(() => fim(true), 4000);
    audio.preload = "auto";
    audio.src = url;
    audio.load();
  });
}

async function precarregarMidia(assets, aoProgredir) {
  const midia = { fundos: {}, sprites: {}, musicas: {}, sfx: {}, ausentes: [] };
  const grupos = [
    ["fundos", carregarImagem],
    ["sprites", carregarImagem],
    ["musicas", carregarAudio],
    ["sfx", carregarAudio],
  ];

  const itens = [];
  for (const [grupo, carregar] of grupos) {
    for (const [id, caminho] of Object.entries(assets[grupo] ?? {})) {
      itens.push({ grupo, carregar, id, url: (assets.base ?? "") + caminho });
    }
  }

  let feitos = 0;
  aoProgredir?.(0, itens.length);

  await Promise.all(
    itens.map(async ({ grupo, carregar, id, url }) => {
      const recurso = await carregar(url);
      midia[grupo][id] = recurso;
      if (!recurso) midia.ausentes.push(url);
      aoProgredir?.(++feitos, itens.length);
    })
  );

  return midia;
}

// Fontes da web (Google Fonts, ver index.html). Se falhar ou demorar, o
// jogo usa as fontes de reserva do config.js.
async function carregarFontes() {
  if (typeof document === "undefined" || !document.fonts) return;
  const pedidos = ["24px Nunito", "italic 24px Nunito", "bold 28px Nunito", "64px 'Permanent Marker'"]
    .map((f) => document.fonts.load(f));
  await Promise.race([Promise.allSettled(pedidos), new Promise((r) => setTimeout(r, 3000))]);
}

export async function carregarTudo(aoProgredir) {
  const [cena, assets, personagens] = await Promise.all([
    lerJSON(CONFIG.CAMINHOS.cena),
    lerJSON(CONFIG.CAMINHOS.assets),
    lerJSON(CONFIG.CAMINHOS.personagens),
    carregarFontes(),
  ]);
  const midia = await precarregarMidia(assets, aoProgredir);
  return { cena, assets, personagens, midia };
}