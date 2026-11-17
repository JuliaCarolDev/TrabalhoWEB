# Cotidiano IFSP — Visual Novel (esqueleto)

## Como rodar
    python server.py
O navegador abre em http://localhost:8000

## Estrutura
    server.py          servidor local (só biblioteca padrão do Python)
    index.html         página com o <canvas>
    css/style.css      escala o canvas na janela (16:9)
    js/config.js       constantes (resolução, fontes, cores, caminhos)
    js/input.js        escutadores de teclado/mouse (só anotam eventos)
    js/assets.js       carrega os 3 JSONs (Promise.all) e pré-carrega mídia
    js/som.js          música em loop + efeitos sonoros
    js/roteiro.js      ponteiro do roteiro (nó + índice) e variáveis
    js/game.js         loop, estados e executor de comandos
    js/main.js         ponto de entrada
    data/cena01.json   roteiro (nós e comandos)
    data/assets.json   ID -> caminho do arquivo de mídia
    data/personagens.json  nomes e cores
    assets/            imagens e áudios (opcionais no modo de teste)

## Controles
Clique, Espaço, Enter ou seta direita: completa o texto / avança.
Escolhas: clique, setas + Enter, ou teclas 1, 2, 3.
F2: liga/desliga o painel de teste (nó, variáveis, eventos).