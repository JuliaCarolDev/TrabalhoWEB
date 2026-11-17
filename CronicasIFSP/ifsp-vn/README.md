# Cotidiano IFSP — Visual Novel (esqueleto)

## Como rodar
    python server.py
O navegador abre em http://localhost:8000

## Estrutura
    server.py        servidor local (só biblioteca padrão do Python)
    index.html       página com o <canvas>
    css/style.css    escala o canvas na janela (16:9)
    js/config.js     constantes (resolução, cores, velocidade do texto)
    js/input.js      escutadores de teclado/mouse (só anotam eventos)
    js/game.js       estados, loop de atualização/desenho, roteiro
    js/main.js       ponto de entrada
    data/cena01.json roteiro da cena (história como dados)

## Controles
Clique, Espaço, Enter ou seta direita: completa o texto / avança.
