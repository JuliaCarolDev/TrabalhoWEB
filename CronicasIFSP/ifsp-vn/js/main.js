// Ponto de entrada: só cria o jogo e liga o motor.

import { Jogo } from "./game.js";

const canvas = document.getElementById("tela");
const jogo = new Jogo(canvas);
jogo.iniciar();