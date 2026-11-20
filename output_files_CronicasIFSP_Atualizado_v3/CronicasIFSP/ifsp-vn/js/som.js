// SOM: gerencia músicas de fundo e efeitos sonoros.

import { CONFIG } from "./config.js";

export class Som {
  constructor(midia) {
    this.musicas = midia.musicas;
    this.sfx = midia.sfx;
    this.musicaAtual = null;
    this.idMusica = null;
    this.sfxAtual = null; // Guarda a referência do último efeito sonoro tocado
  }

  tocarMusica(id) {
    if (id === this.idMusica) return;
    this.pararMusica();
    this.idMusica = id;
    const audio = id ? this.musicas[id] : null;
    if (!audio) return;
    audio.loop = true;
    audio.volume = CONFIG.VOLUME.musica;
    audio.currentTime = 0;
    this._tocar(audio);
    this.musicaAtual = audio;
  }

  atualizarVolume() {
    if (this.musicaAtual) {
      this.musicaAtual.volume = CONFIG.VOLUME.musica;
    }
  }

  pararMusica() {
    if (this.musicaAtual) {
      this.musicaAtual.pause();
      this.musicaAtual.currentTime = 0;
    }
    this.musicaAtual = null;
    this.idMusica = null;
  }

  tocarSfx(id) {
    const base = this.sfx[id];
    if (!base) return;

    // Se já houver um efeito sonoro tocando e você quiser interrompê-lo ao iniciar outro:
    if (this.sfxAtual) {
      this.sfxAtual.pause();
      this.sfxAtual.currentTime = 0;
    }

    const copia = base.cloneNode(true);
    copia.volume = CONFIG.VOLUME.sfx;

    // Salva a referência e limpa quando terminar
    this.sfxAtual = copia;
    copia.onended = () => {
      if (this.sfxAtual === copia) this.sfxAtual = null;
    };

    this._tocar(copia);
  }

  _tocar(audio) {
    const promessa = audio.play();
    if (promessa) promessa.catch(() => { });
  }
}