// SOM: uma música de fundo por vez (em loop) + efeitos sonoros sobrepostos.
// Se o arquivo não existe (null), simplesmente não toca nada.

import { CONFIG } from "./config.js";

export class Som {
  constructor(midia) {
    this.musicas = midia.musicas;
    this.sfx = midia.sfx;
    this.musicaAtual = null;
    this.idMusica = null;
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
    const copia = base.cloneNode(true);   // permite sobrepor o mesmo efeito
    copia.volume = CONFIG.VOLUME.sfx;
    this._tocar(copia);
  }

  // Navegadores bloqueiam áudio antes do 1º clique; ignoramos a recusa.
  _tocar(audio) {
    const promessa = audio.play();
    if (promessa) promessa.catch(() => {});
  }
}