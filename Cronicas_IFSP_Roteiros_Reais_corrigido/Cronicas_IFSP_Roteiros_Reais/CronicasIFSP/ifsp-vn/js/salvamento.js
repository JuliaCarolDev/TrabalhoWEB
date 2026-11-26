// SALVAMENTO (persistência via localStorage)

import { CONFIG } from "./config.js";

export class Salvamento {
  static _chave(slot) {
    return `${CONFIG.CHAVE_SAVE}.slot${slot}`;
  }

  static gravar(slot, dados) {
    try {
      localStorage.setItem(this._chave(slot), JSON.stringify(dados));
      return true;
    } catch (e) {
      console.error("Erro ao gravar save:", e);
      return false;
    }
  }

  static ler(slot) {
    try {
      const bruto = localStorage.getItem(this._chave(slot));
      return bruto ? JSON.parse(bruto) : null;
    } catch (e) {
      console.error("Erro ao ler save:", e);
      return null;
    }
  }

  static apagar(slot) {
    try {
      localStorage.removeItem(this._chave(slot));
      return true;
    } catch {
      return false;
    }
  }
}
