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
## Tela inicial (revisão visual)
A tela inicial usa tipografia Bebas Neue + DM Sans, fundo com textura editorial discreta e menu em fichas numeradas. O crachá animado foi preservado. As fontes são carregadas do Google Fonts quando há conexão com a internet; há fontes alternativas do sistema.


## Ato II — O Turno da Manhã e o Caos Acadêmico
O Ato II foi integrado ao roteiro `data/cena01.json`. Ao concluir o Ato I, a tela de relatório oferece a opção **Continuar para o Ato II**; a confirmação executa a abertura cinematográfica do novo ato e preserva variáveis, inventário e afinidades. Ao concluir o Ato II, a tela informa o Ato III como próximo capítulo e retorna ao menu, pois o roteiro do Ato III ainda não foi incluído.

### Recursos de mídia do Ato II
O manifesto `data/assets.json` inclui os IDs de cenários e sprites mencionados no roteiro. O ZIP de origem não continha os arquivos de imagem/áudio correspondentes; por isso, os personagens aparecem com os placeholders do motor e os cenários usam o fallback de cor até que os arquivos sejam adicionados e seus caminhos preenchidos no manifesto. A música `bgm_intervalo_livre.ogg` também pode ser adicionada ao manifesto quando o arquivo estiver disponível.
