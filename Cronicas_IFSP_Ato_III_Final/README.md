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


## Ato III — A Reta Final do Turno e o Balcão da CAI
O Ato III foi integrado ao roteiro e conectado ao encerramento do Ato II. A passagem apresenta abertura cinematográfica do Ato III, cena final das aulas, bifurcação entre o atendimento na CAI (quando `celularConfiscado` é verdadeiro) e o caminho livre, decisões condicionadas aos itens/atributos obtidos anteriormente, epílogo e cálculo de três desfechos.

### Desfechos e tela final
- **Lenda do Campus:** celular não confiscado, Sobrevivência Acadêmica >= 20 e média de afinidade com professores >= 65.
- **Estudante Raiz:** celular não confiscado e escolha de ir estudar para o simulado da Profª Paula.
- **Sobrevivente da CAI:** passou pela CAI e recuperou o celular sem advertência grave.

A tela final apresenta o desfecho desbloqueado e dois botões: **Voltar para a tela inicial** e **Ir para cenas extras**. A área de cenas extras já tem uma tela própria de arquivo, com cartões reservados para conteúdo futuro e retorno ao menu.

### Novos recursos de mídia
O manifesto `data/assets.json` contém IDs para os novos cenários, sprites, músicas e efeitos sonoros. Os caminhos permanecem vazios porque o ZIP-base não continha esses arquivos. Adicione as mídias correspondentes na pasta de assets e preencha os caminhos no manifesto para substituir os placeholders e ativar os sons.
