# Crônicas do IFSP — Visual Novel (esqueleto)

## Como rodar
    python server.py
O navegador abre em http://localhost:8000
(sem Python: extensão Live Server do VS Code, "Open with Live Server" no index.html)

## Estrutura
    server.py          servidor local (só biblioteca padrão do Python)
    index.html         página com o <canvas> e as fontes (Google Fonts)
    css/style.css      escala o canvas na janela (16:9)
    js/config.js       constantes: resolução, fontes, cores, menus, créditos
    js/input.js        escutadores de teclado/mouse (só anotam eventos)
    js/assets.js       carrega os 3 JSONs (Promise.all), fontes e mídia
    js/som.js          música em loop + efeitos sonoros
    js/roteiro.js      ponteiro do roteiro (nó + índice) e variáveis
    js/menu.js         lista de botões (mouse + teclado)
    js/salvamento.js   slots de save no localStorage
    js/visual.js       lousa, título, crachá e botões do menu
    js/game.js         loop, estados e executor de comandos
    js/main.js         ponto de entrada
    data/cena01.json   roteiro (nós, comandos e rótulos da ficha do aluno)
    data/assets.json   ID -> caminho do arquivo de mídia
    data/personagens.json  nomes e cores
    assets/            imagens e áudios (opcionais no modo de teste)

## Controles
Clique, Espaço, Enter ou seta direita: completa o texto / avança.
Escolhas e menus: clique, setas + Enter (escolhas também aceitam 1, 2, 3).
Esc: pausa (continuar, salvar, carregar, voltar ao menu) ou volta uma tela.
F2: liga/desliga o painel de teste.
