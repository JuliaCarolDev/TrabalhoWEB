// Roteiros dos cinco episódios extras e do episódio secreto.
// Os comandos usam a mesma estrutura de falas, escolhas e efeitos dos três atos.
const fala = (quem, texto, acao) => ({ cmd: 'fala', quem, texto, ...(acao ? { acao } : {}) });
const fundo = (id) => ({ cmd: 'fundo', id });
const mostrar = (personagem, sprite, posicao = 'centro') => ({ cmd: 'mostrar', personagem, sprite, posicao, entrada: 'fade' });
const esconder = (personagem) => ({ cmd: 'esconder', personagem });
const rep = (personagem, valor) => ({ cmd: 'reputacao', personagem, valor });
const soma = (variavel, valor) => ({ cmd: 'somar', var: variavel, valor });
const item = (id, nome, descricao, icone = '📚') => ({ cmd: 'item_adicionar', id, nome, descricao, icone });
const escolha = (titulo, opcoes) => ({ cmd: 'escolha', titulo, opcoes });
const ir = (no) => ({ cmd: 'ir', no });
const cond = (condicoes, irSim, irNao) => ({ cmd: 'condicional', condicoes, ir: irSim, senao: irNao });
const fim = () => ({ cmd: 'fim_extra' });
const no = (...comandos) => comandos;

export const CENAS_EXTRAS = [
  {
    id: 'ana_lucia', professor: 'Profª Ana Lúcia', titulo: 'O DILEMA DA FILA DA CANTINA',
    subtitulo: 'Uma investigação filosófica no intervalo',
    nos: {
      inicio: no(
        fundo('bg_cantina_intervalo'),
        { cmd: 'musica', id: 'bgm_filosofia_leve' },
        fala('narrador', 'Doze horas e cinco minutos. O horário em que as leis da física e da civilidade parecem suspensas no pátio do IFSP por um único objetivo: garantir o último salgado antes que a estufa esvazie.'),
        mostrar('ana_lucia', 'analucia_sorriso_provocador'),
        fala('narrador', 'Você entra na fila e percebe uma figura familiar parada exatamente no meio do caminho, observando o movimento como se assistisse a uma peça grega.'),
        fala('ana_lucia', 'Olha só quem apareceu na caverna de Platão. Você entrou nessa fila porque realmente está com fome ou porque viu todo mundo correndo e seguiu o rebanho?'),
        fala('protagonista', 'Bom dia, professora! Acho que é noventa por cento fome e dez por cento medo de ficar sem lanche.'),
        fala('ana_lucia', 'Sinceridade empírica! Gosto disso. Aproveita que esta fila anda na velocidade de uma tartaruga de Zenão e me ajuda a resolver um impasse filosófico.'),
        fala('ana_lucia', 'Restam exatamente três coxinhas e existem sete pessoas na nossa frente. Qual é a postura mais racional?'),
        escolha('O QUE VOCÊ RESPONDE?', [
          { texto: 'Aceitar o destino com estoicismo: se acabar, tomo água e sigo em frente.', ir: 'resposta_a', efeitos: [rep('ana_lucia', 5), soma('sobrevivencia', 2)] },
          { texto: 'Questionar o sistema: por que a cantina não faz mais coxinhas se a demanda é sempre maior?', ir: 'resposta_b', efeitos: [rep('ana_lucia', 10), soma('sobrevivencia', 12)] },
          { texto: 'Usar o livre-arbítrio e pedir um biscoito na sala da Diretora Carol.', ir: 'resposta_c', efeitos: [rep('ana_lucia', 12), soma('sobrevivencia', 7)] },
        ])
      ),
      resposta_a: no(fala('ana_lucia', 'Marco Aurélio ficaria orgulhoso! Controlar apenas aquilo que está ao nosso alcance — inclusive o próprio estômago. Muito bem.'), ir('tempo')),
      resposta_b: no(fala('ana_lucia', 'Ah, o despertar da consciência crítica! Marx analisaria a mais-valia do salgado enquanto a gente morre de fome aqui atrás. Excelente ponto!'), ir('tempo')),
      resposta_c: no(fala('ana_lucia', 'A saída pragmática! Nem Sócrates pensou em terceirizar o lanche para a diretoria. Você já entendeu como o campus funciona.'), ir('tempo')),
      tempo: no(
        fala('narrador', 'A fila anda dois passos. No corredor principal, Fábio caminha calmamente com sua prancheta, conferindo o horário.'),
        fala('ana_lucia', 'Veja lá. O tempo cronológico, Chronos, representado pela CAI prestes a tocar o sinal. Por que vinte minutos de intervalo passam em dois segundos, enquanto vinte minutos de aula parecem uma eternidade?'),
        escolha('COMO VOCÊ EXPLICA?', [
          { texto: 'O tempo é relativo e depende de quanto estamos nos divertindo — ou sofrendo.', ir: 'tempo_reacao', efeitos: [rep('ana_lucia', 5), soma('sobrevivencia', 5)] },
          { texto: 'O sinal do IFSP foi programado para testar a paciência humana.', ir: 'tempo_reacao', efeitos: [rep('ana_lucia', 5)] },
          { texto: 'Na aula não podemos olhar o celular sem arriscar uma visita ao Fábio.', ir: 'tempo_reacao', efeitos: [soma('riscoCAI', 5), soma('sobrevivencia', -6)] },
        ])
      ),
      tempo_reacao: no(
        fala('ana_lucia', 'Exatamente! Bergson chamava isso de duração: o tempo vivido pela consciência não é o mesmo do relógio. E, no IFSP, o relógio da parede sempre parece conspirar contra o descanso de vocês.'),
        fala('narrador', 'Finalmente, vocês chegam ao balcão. A atendente olha para a estufa: sobrou apenas um pão de queijo.'),
        fala('ana_lucia', 'Eis o teste final da ética prática. Só restou um. Vai exercer o egoísmo racional ou o altruísmo?'),
        escolha('O QUE VOCÊ FAZ?', [
          { texto: 'Pode pegar, professora! A senhora ainda tem aula dupla para dar.', ir: 'final_a', efeitos: [rep('ana_lucia', 15)] },
          { texto: 'Vamos dividir ao meio — contrato social justo!', ir: 'final_b', efeitos: [rep('ana_lucia', 5)] },
        ])
      ),
      final_a: no(fala('ana_lucia', 'Além de bom argumentador, tem senso de justiça distributiva! Eu pago um suco para você como agradecimento. Conversar com vocês sempre salva o meu dia.'), ir('encerramento')),
      final_b: no(fala('ana_lucia', 'Rousseau aprovaria esse contrato social! Meio pão de queijo para cada um e a paz restaurada no pátio.'), ir('encerramento')),
      encerramento: no(
        { cmd: 'sfx', id: 'sfx_sinal' },
        fala('narrador', 'TRIIIIIM! O sinal do fim do intervalo ecoa pelo campus.'),
        fala('ana_lucia', 'Lá vai Chronos chamando de volta. Valeu pela companhia na fila, meu caro filósofo! Até a próxima aula!'),
        fala('narrador', 'Episódio da Profª Ana Lúcia concluído! Conquista desbloqueada: Sócrates do Intervalo.'),
        fim()
      ),
    },
  },
  {
    id: 'fabiana', professor: 'Profª Fabiana', titulo: 'O COLAPSO GRAVITACIONAL NO CORREDOR',
    subtitulo: 'Uma missão de resgate literário',
    nos: {
      inicio: no(
        fundo('bg_corredor_professores'),
        { cmd: 'musica', id: 'bgm_literatura_leve' },
        fala('narrador', 'O sol de fim de tarde tinge os corredores do IFSP de laranja. Às 17h15, o campus entra no silêncio de pós-aula — interrompido por papéis deslizando e uma exclamação dramática.'),
        { cmd: 'sfx', id: 'sfx_papeis' },
        fala('fabiana', 'Não, não, não! Cecília Meireles, segura o Machado de Assis! Alguém segure o Realismo!'),
        mostrar('fabiana', 'fabiana_desesperada_sorrindo'),
        fala('narrador', 'Você vira a esquina e encontra a Profª Fabiana ajoelhada no chão, tentando impedir que pastas, cadernos de chamada e livros deslizem pelo piso. A alça da ecobag literária está partida.'),
        fala('fabiana', 'Um ser humano vivo no corredor! Por favor, me ajuda a salvar o patrimônio literário do terceiro ano antes que a biblioteca feche!'),
        escolha('COMO VOCÊ AJUDA?', [
          { texto: 'Pegar imediatamente a pilha de livros pesados da Biblioteca.', ir: 'ajuda_ab', efeitos: [rep('fabiana', 15), soma('sobrevivencia', 12)] },
          { texto: 'Recolher as folhas soltas antes que o vento leve tudo.', ir: 'ajuda_ab', efeitos: [rep('fabiana', 10), soma('sobrevivencia', 9)] },
          { texto: 'Pegar a caneca vazia: “Professora, a senhora precisa de café urgente!”', ir: 'ajuda_c', efeitos: [rep('fabiana', 2)] },
        ])
      ),
      ajuda_ab: no(fala('fabiana', 'Você é um anjo enviado pela Academia Brasileira de Letras! Minha bolsa decidiu se aposentar exatamente no pior momento da semana.'), ir('biblioteca')),
      ajuda_c: no(fala('fabiana', 'Você leu a minha alma! Sem café eu não consigo nem diferenciar parnasianismo de simbolismo. Vou passar na copa por dez segundos e já seguimos!'), ir('biblioteca')),
      biblioteca: no(
        fundo('bg_biblioteca_tarde'),
        fala('narrador', 'Às 17h22, vocês entram na Biblioteca. Restam oito minutos para fechar. As mesas estão quase vazias, exceto por um aluno adormecido sobre um livro de Cálculo.'),
        fala('fabiana', 'Os livros vão para a devolução, mas as folhas misturaram meus rascunhos de poesia com justificativas de atraso e fichamentos. Me ajuda a separar?'),
        fala('fabiana', 'Folha número um: “O vento soprou forte na estação, o ônibus atrasou e a alma perdeu o primeiro tempo da manhã.” Isso é Modernismo ou justificativa da turma de Informática?'),
        escolha('TRIAGEM POÉTICA — FOLHA 1', [
          { texto: 'Justificativa de aluno que perdeu o primeiro horário!', ir: 'folha1_certa', efeitos: [rep('fabiana', 5), soma('sobrevivencia', 5)] },
          { texto: 'Um verso perdido de Carlos Drummond de Andrade.', ir: 'folha1_errada', efeitos: [rep('fabiana', -5)] },
        ])
      ),
      folha1_certa: no(fala('fabiana', 'Acertou! Mas confesso que tem um ritmo poético bem convincente. Vai para a pasta de ocorrências!'), ir('folha2')),
      folha1_errada: no(fala('fabiana', 'Quase! A poesia está convincente, mas a pontualidade da turma é uma fonte inesgotável de inspiração. Essa vai para as justificativas!'), ir('folha2')),
      folha2: no(
        fala('fabiana', 'Agora esta: “No meio do caminho tinha uma catraca travada, tinha uma catraca travada no meio do caminho.” Essa é fácil!'),
        escolha('TRIAGEM POÉTICA — FOLHA 2', [
          { texto: 'Paródia de Drummond feita por alguém que esqueceu o crachá!', ir: 'folha2_certa', efeitos: [rep('fabiana', 5), soma('sobrevivencia', 5)] },
          { texto: 'Texto original da Semana de Arte Moderna de 1922.', ir: 'folha2_errada', efeitos: [rep('fabiana', -5)] },
        ])
      ),
      folha2_certa: no(fala('fabiana', 'Gênio! Olha o talento desperdiçado nos corredores deste instituto!'), ir('epilogo')),
      folha2_errada: no(fala('fabiana', 'Uma interpretação ousada! Mas Drummond provavelmente pediria que devolvessem o crachá antes de publicar a paródia.'), ir('epilogo')),
      epilogo: no(
        { cmd: 'sfx', id: 'sfx_shhh' },
        fala('fabiana', 'Ops! Perdão! Até a literatura precisa respeitar o silêncio da biblioteca!'),
        fundo('bg_corredor_professores'),
        fala('narrador', 'Às 17h29, o último livro é devolvido e todas as pastas estão organizadas. Vocês saem juntos para o corredor principal.'),
        fala('fabiana', 'Missão cumprida sem nenhuma baixa literária! A rotina entre aulas, correções e reuniões parece um romance realista pesado, mas alunos que param para ajudar transformam tudo numa crônica mais leve.'),
        fala('narrador', 'Ela tira do caderno um marcador de página decorado com um verso escrito à mão e entrega a você.'),
        fala('fabiana', 'Guarda com você. Dá sorte nas redações e serve como passe livre para tirar dúvidas de Literatura — desde que haja café por perto!'),
        item('marcador_poetico', 'Marcador de Página Poético', 'Um marcador artesanal com um verso escrito à mão pela Profª Fabiana.'),
        fala('fabiana', 'Bom descanso, meu poeta! E não esqueça de ler o capítulo para sexta-feira!'),
        fala('narrador', 'Episódio da Profª Fabiana concluído! Conquista desbloqueada: Guardião do Lirismo.'),
        fim()
      ),
    },
  },
  {
    id: 'marcos', professor: 'Prof. Marcos', titulo: 'A GRANDE NOITE NO CAMPUS',
    subtitulo: 'Mostra Cultural — sexta-feira, 19h',
    nos: {
      inicio: no(
        fundo('bg_auditorio_entrada'),
        { cmd: 'musica', id: 'bgm_mostra_cultural' },
        fala('narrador', 'O auditório está irreconhecível. Banners pintados à mão decoram as paredes, refletores improvisados iluminam a entrada e o burburinho de alunos, familiares e servidores anuncia a grande noite da Mostra Cultural.'),
        mostrar('marcos', 'marcos_gala_dramatico'),
        fala('narrador', 'Na porta, o Prof. Marcos confere a lista de apresentações com uma prancheta em uma mão e uma boina estilosa na cabeça. Ele gesticula para a equipe de som como um maestro.'),
        fala('marcos', 'Mais luz no centro do palco! Quero sentir a alma do Renascimento naquela cortina! Ah, boa noite! Que alegria ver você prestigiando o templo das artes do nosso campus!'),
        cond([{ item: 'ingresso_mostra_cultural' }], 'vip', 'plateia')
      ),
      vip: no(
        fala('marcos', 'Ora, ora! Um benfeitor das artes! Você ajudou a erguer o cenário e agora porta o passe dourado dos bastidores. Venha comigo — o lugar de quem constrói o espetáculo é onde a mágica acontece!'),
        fundo('bg_bastidores_palco'),
        fala('narrador', 'Nos bastidores, o cheiro de tinta acrílica fresca se mistura à adrenalina antes da abertura das cortinas. Marcos se aproxima em tom confidencial.'),
        fala('marcos', 'Temos uma emergência digna de Shakespeare! O narrador ficou sem voz. Preciso que você assuma o microfone oculto na coxia e faça a abertura. Aceita?'),
        escolha('QUAL TOM VOCÊ DÁ À NARRAÇÃO?', [
          { texto: 'Épico: “Das cinzas dos trabalhos entregues na última hora, ergue-se a criatividade indomável do IFSP!”', ir: 'vip_epico', efeitos: [rep('marcos', 5)] },
          { texto: 'Poético: “Entre fórmulas, códigos e cafés, a arte floresce onde menos se espera.”', ir: 'vip_poetico', efeitos: [rep('fabiana', 3)] },
          { texto: 'Bem-humorado: “Nem a fila da cantina nem o balcão da CAI puderam deter o talento desta noite!”', ir: 'vip_humor', efeitos: [rep('marcos', 5), rep('fabio', 5), rep('carol', 5), soma('sobrevivencia', 5)] },
        ])
      ),
      vip_epico: no(fala('marcos', 'Uma abertura grandiosa! O espírito do campus se ergue como uma obra-prima diante dos nossos olhos!'), ir('vip_fim')),
      vip_poetico: no(fala('marcos', 'Delicado e preciso! A arte realmente encontra espaço entre as fórmulas e os códigos. Fabiana vai adorar essa frase!'), ir('vip_fim')),
      vip_humor: no(fala('narrador', 'Um murmúrio de risadas atravessa o auditório — incluindo uma risada sincera de Fábio e da Diretora Carol na primeira fileira.'), fala('marcos', 'Bravíssimo! Você captou a essência trágico-cômica da juventude federal! O público está em suas mãos!'), ir('vip_fim')),
      vip_fim: no(
        fala('narrador', 'As cortinas se abrem e revelam a pintura gigante feita pelos alunos. O auditório explode em aplausos. Dos bastidores, você assiste ao espetáculo ao lado de Marcos.'),
        fala('marcos', 'Você não apenas assistiu à Mostra: ajudou a fazer a noite acontecer. Isso merece aplausos de pé!'),
        { cmd: 'definir', var: 'cg_triunfo_bastidores', valor: true },
        { cmd: 'aviso', texto: 'CG Especial desbloqueada: O Triunfo nos Bastidores', positivo: true },
        ir('encerramento_vip')
      ),
      plateia: no(
        fala('marcos', 'A plateia é o coração pulsante de qualquer espetáculo! Sem olhos para contemplar, a pintura é apenas pigmento e o teatro é apenas ensaio. Entre e escolha um bom lugar!'),
        fundo('bg_auditorio_plateia'),
        esconder('marcos'),
        mostrar('fabiana', 'fabiana_cafe_feliz', 'esquerda'),
        mostrar('gabriel', 'gabriel_sorriso_zoando', 'direita'),
        fala('narrador', 'Você encontra uma poltrona livre atrás de Fabiana, que anota as poesias declamadas, e Gabriel, que comenta cada entrada como se fosse uma batalha histórica.'),
        fala('gabriel', 'Olha só o Marcos lá na frente... está dirigindo a peça com mais emoção do que Napoleão atravessando os Alpes!'),
        fala('narrador', 'As luzes se apagam. Marcos sobe ao palco sob um único holofote e declama a abertura com uma voz que ecoa até o bloco administrativo.'),
        escolha('COMO VOCÊ REAGE?', [
          { texto: 'Puxar uma salva de palmas antes mesmo de ele terminar a frase.', ir: 'plateia_reacao', efeitos: [rep('marcos', -2), soma('sobrevivencia', -2)] },
          { texto: 'Gritar “BRAVO, MAESTRO!” do meio da plateia.', ir: 'plateia_reacao', efeitos: [rep('marcos', 5)] },
          { texto: 'Filmar o momento para a Diretora Carol postar no Instagram do campus.', ir: 'plateia_reacao', efeitos: [rep('marcos', 5), rep('carol', 5), soma('sobrevivencia', 5)] },
        ])
      ),
      plateia_reacao: no(
        fala('marcos', 'É dessa energia que o palco se alimenta! Obrigado, querido público! Que comecem as apresentações!'),
        fala('narrador', 'Durante a próxima hora, você assiste a peças teatrais, apresentações musicais e exposições de pintura. Mesmo da plateia, a paixão de Marcos transforma a noite em uma verdadeira estreia de cinema.'),
        ir('encerramento_plateia')
      ),
      encerramento_vip: no(fala('narrador', 'Às 21h15, o auditório começa a esvaziar. Marcos aparece na saída com a boina torta e um sorriso de realização.'), fala('marcos', 'Mais uma edição entra para a história! A ciência e a técnica nos dão ferramentas para construir o mundo, mas é a arte que nos lembra por que vale a pena viver nele. Obrigado por fazer parte desta noite!'), fala('narrador', 'Conquista desbloqueada: Estrela do IFSP.'), fim()),
      encerramento_plateia: no(fala('narrador', 'Às 21h15, o auditório começa a esvaziar. Marcos aparece na saída com a boina torta e um sorriso de realização.'), fala('marcos', 'Mais uma edição entra para a história! A ciência e a técnica nos dão ferramentas para construir o mundo, mas é a arte que nos lembra por que vale a pena viver nele. Obrigado por fazer parte desta noite!'), fala('narrador', 'Conquista desbloqueada: Crítico de Arte.'), fim()),
    },
  },
  {
    id: 'paula', professor: 'Profª Paula', titulo: 'O CHAMADO DO LABORATÓRIO',
    subtitulo: 'Operação Darwin — revisão relâmpago',
    nos: {
      inicio: no(
        fundo('bg_corredor_laboratorios'),
        { cmd: 'musica', id: 'bgm_biologia_energia' },
        fala('narrador', 'Quinta-feira, 14h30. O corredor dos laboratórios está tranquilo, até que uma voz enérgica ecoa do Laboratório de Biologia, acompanhada pelo som de um pincel atômico no quadro.'),
        { cmd: 'sfx', id: 'sfx_quadro' },
        fala('paula', 'Não adianta mutação aleatória se não houver pressão seletiva! E a pressão seletiva de vocês tem data marcada no calendário da FUVEST e do ENEM!'),
        mostrar('paula', 'paula_energetica_jaleco'),
        fala('narrador', 'Você espia pelo vidro. Paula está diante de uma árvore filogenética, cercada por um esqueleto anatômico e apostilas antigas. Ao notar você, ela acena.'),
        fala('paula', 'O destino evolutivo trouxe você até o laboratório no momento exato! Estou testando uma revisão relâmpago para ver quem sobrevive ao semestre sem entrar em extinção acadêmica. Topa ser minha cobaia voluntária?'),
        escolha('COMO VOCÊ RESPONDE?', [
          { texto: 'Com certeza! Preciso garantir meu lugar no topo da cadeia alimentar do vestibular.', ir: 'convite_a', efeitos: [rep('paula', 15), soma('sobrevivencia', 5)] },
          { texto: 'Só se não valer nota no boletim de hoje!', ir: 'convite_b', efeitos: [rep('paula', 5)] },
          { texto: 'Vim só pegar água, mas Darwin diria que quem não se adapta perde a chance!', ir: 'convite_c', efeitos: [rep('paula', 5)] },
        ])
      ),
      convite_a: no(fala('paula', 'Excelente! Ambição acadêmica com consciência ecológica. Senta aí na bancada!'), ir('quiz1')),
      convite_b: no(fala('paula', 'Sem nota hoje! Só conhecimento e uma pequena dose de adrenalina científica. Senta aí!'), ir('quiz1')),
      convite_c: no(fala('paula', 'Brilhante! Já entendeu o conceito-chave: não é quem decora mais páginas que passa, mas quem melhor se adapta ao estilo da prova. Senta aí!'), ir('quiz1')),
      quiz1: no(
        fundo('bg_laboratorio_biologia'),
        fala('narrador', 'Você se senta em um banco alto. Paula coloca um cronômetro imaginário no pulso e assume a postura de apresentadora de um programa científico.'),
        fala('paula', 'Bem-vindos à Operação Darwin! Três perguntas rápidas misturando Biologia, sociedade e sobrevivência no IFSP. Primeira: metade dos estudantes atravessa o pátio olhando o celular e esbarra na CAI; a outra metade guarda o aparelho e chega intacta. Segundo Darwin, o que aconteceu?'),
        escolha('PERGUNTA 1 — SELEÇÃO NATURAL', [
          { texto: 'Seleção natural: o ambiente favoreceu os indivíduos com comportamentos mais adaptados ao campus.', ir: 'quiz1_certo', efeitos: [soma('sobrevivencia', 10), rep('paula', 3)] },
          { texto: 'Lamarckismo: os alunos desenvolveram olhos nas costas pelo uso contínuo.', ir: 'quiz1_errado', efeitos: [rep('paula', -5), soma('sobrevivencia', -10)] },
          { texto: 'Mutação espontânea causada pelo café da cantina.', ir: 'quiz1_errado2', efeitos: [rep('paula', 2)] },
        ])
      ),
      quiz1_certo: no(fala('paula', 'Na mosca! Lamarck tentaria explicar pelo uso e desuso, mas Darwin explica por que os veteranos sobrevivem até o terceiro ano!'), ir('quiz2')),
      quiz1_errado: no(fala('paula', 'Cuidado com a pegadinha! Lamarck falava de características adquiridas pelo uso — o que não ajuda a desviar do Fábio. A resposta é seleção natural!'), ir('quiz2')),
      quiz1_errado2: no(fala('paula', 'Seria uma descoberta e tanto, mas o café não causa mutações direcionadas. A resposta é seleção natural: o ambiente favorece certas características.'), ir('quiz2')),
      quiz2: no(
        fala('paula', 'Segunda pergunta, interdisciplinaridade do ENEM! Quando o equilíbrio de um ecossistema é quebrado pela falta de planejamento e de políticas públicas de preservação, o que acontece?'),
        escolha('PERGUNTA 2 — ECOLOGIA E POLÍTICA', [
          { texto: 'Perda de recursos naturais, desequilíbrio climático e impacto na qualidade de vida da população.', ir: 'quiz2_certo', efeitos: [rep('paula', 10), soma('sobrevivencia', 4)] },
          { texto: 'Nada: a natureza sempre se recupera sozinha em uma semana.', ir: 'quiz2_errado', efeitos: [rep('paula', -10), soma('sobrevivencia', -12)] },
        ])
      ),
      quiz2_certo: no(fala('paula', 'Exatamente! Biologia nunca está separada da política e da cidadania. Entender o ambiente é entender como proteger nosso futuro — e acertar a prova!'), ir('quiz3')),
      quiz2_errado: no(fala('paula', 'Não é bem assim. Ecossistemas podem sofrer danos duradouros. Preservação exige planejamento e políticas públicas consistentes.'), ir('quiz3')),
      quiz3: no(
        fala('paula', 'Última pergunta! Se você cruzar um dia de sono atrasado com uma pilha de listas acumuladas na sexta-feira, qual é o fenótipo dominante na segunda de manhã?'),
        escolha('PERGUNTA 3 — GENÉTICA DA RETA FINAL', [
          { texto: 'Olheiras recessivas com dependência severa de cafeína.', ir: 'quiz3_certo', efeitos: [rep('paula', 2)] },
          { texto: 'Energia infinita e disposição atlética às sete da manhã.', ir: 'quiz3_errado', efeitos: [rep('paula', -5), soma('sobrevivencia', -10)] },
        ])
      ),
      quiz3_certo: no(fala('paula', 'Genética pura do ensino médio integrado! Nenhum alelo dominante vence uma noite mal dormida antes da aula dupla!'), ir('conselho')),
      quiz3_errado: no(fala('paula', 'Uma hipótese otimista, mas pouco provável! Nenhum alelo dominante vence uma noite mal dormida antes da aula dupla.'), ir('conselho')),
      conselho: no(
        fala('paula', 'Brincadeiras à parte, você mandou bem. Falo de vestibular e prazos porque sei o potencial de vocês. Às vezes a pressão parece gigante, mas evolução é um processo gradual: um passo por dia.'),
        fala('narrador', 'Ela pega uma ficha plastificada com um esquema colorido de Biologia e entrega a você.'),
        fala('paula', 'Leva este resumo de bolso. Quando bater o desespero antes da prova, respira fundo, toma água e lembra do Darwin!'),
        item('guia_darwin', 'Guia de Bolso de Darwin', 'Ficha plastificada com um esquema de Biologia preparado pela Profª Paula.', '🧬'),
        fala('paula', 'Agora aproveita o resto da tarde — e não esquece de revisar Ecologia!'),
        fala('narrador', 'Episódio da Profª Paula concluído! Conquista desbloqueada: Elo Perdido Aprovado.'),
        fim()
      ),
    },
  },
  {
    id: 'gabriel', professor: 'Prof. Gabriel', titulo: 'O TRIBUNAL NA SALA DE ESTUDO',
    subtitulo: 'Três mistérios históricos do IFSP',
    nos: {
      inicio: no(
        fundo('bg_biblioteca_sala_estudo'),
        { cmd: 'musica', id: 'bgm_historia_misterio' },
        fala('narrador', 'Quarta-feira, 15h45. A Biblioteca está quase em silêncio. Pela porta de vidro da sala de estudo número 3, você vê Gabriel com provas corrigidas, uma garrafa térmica e uma régua de madeira como se fosse o martelo de um juiz.'),
        { cmd: 'sfx', id: 'sfx_batida_porta' },
        mostrar('gabriel', 'gabriel_sorriso_zoando'),
        fala('gabriel', 'Entre, jovem cidadão da República Federativa do IFSP! Sente-se no banco das testemunhas. Acabei de corrigir as provas do segundo ano — um massacre digno de Stalingrado — e agora presido o Tribunal Histórico do Campus.'),
        fala('protagonista', 'Boa tarde, professor! Pelo jeito as notas não foram muito pacíficas...'),
        fala('gabriel', 'Alguns tentaram reescrever a História do Brasil com base em vozes da própria cabeça! Mas preciso de uma testemunha para esclarecer os três maiores mistérios deste instituto.'),
        fala('gabriel', 'Primeiro caso: o Desaparecimento do Café da Copa. Todo dia às nove e meia, a garrafa térmica seca segundos antes de Fabiana chegar. Quem é o culpado?'),
        escolha('PONTO DE DECISÃO 1 — O CAFÉ', [
          { texto: 'Uma conspiração silenciosa entre a turma de Exatas e o sono de segunda-feira.', ir: 'cafe_a', efeitos: [rep('gabriel', 2)] },
          { texto: 'A própria Fabiana já tomou metade antes das oito e esqueceu.', ir: 'cafe_b', efeitos: [rep('gabriel', 10)] },
          { texto: 'O contexto socioeconômico da semana de provas!', ir: 'cafe_c', efeitos: [rep('gabriel', 20), soma('sobrevivencia', 10)] },
        ])
      ),
      cafe_a: no(fala('gabriel', 'Uma hipótese conspiratória! Vou registrar nos autos e investigar a turma de Exatas.'), ir('ar')),
      cafe_b: no(fala('gabriel', 'Acusação gravíssima — e plausível! Fabiana tem uma relação muito próxima com a cafeína.'), ir('ar')),
      cafe_c: no(fala('gabriel', 'A resposta clássica de qualquer prova de Humanas! “A culpa é do contexto!” Se escrever isso no ENEM com convicção, até o corretor fica com medo de discordar!'), ir('ar')),
      ar: no(
        fala('gabriel', 'Segundo mistério: a Guerra Fria do Ar-Condicionado. Metade da sala congela como na Sibéria; a outra metade ferve como no Saara. Como resolver sem chamar Carol?'),
        escolha('PONTO DE DECISÃO 2 — TRATADO DE PAZ', [
          { texto: 'Tratado de Versalhes térmico: 23 graus fixos e ninguém toca no controle!', ir: 'ar_a', efeitos: [rep('gabriel', 5)] },
          { texto: 'Dois blocos geopolíticos: quem tem casaco senta na frente, quem tem calor senta no fundo.', ir: 'ar_b', efeitos: [rep('gabriel', 10)] },
          { texto: 'Deixar o controle sob guarda permanente de Fábio na CAI.', ir: 'ar_c', efeitos: [soma('riscoCAI', 5), rep('gabriel', 20)] },
        ])
      ),
      ar_a: no(fala('gabriel', 'Um tratado rígido, mas objetivo. Espero que não termine como o original!'), ir('apelido')),
      ar_b: no(fala('gabriel', 'Uma divisão territorial pacífica! Desde que ninguém construa um muro no meio da sala.'), ir('apelido')),
      ar_c: no(fala('gabriel', 'Genial! Paz armada através do respeito absoluto à CAI. Nem Bismarck pensaria numa estratégia tão eficiente!'), ir('apelido')),
      apelido: no(
        fala('gabriel', 'Último caso: a Lenda do Apelido do Professor de História. Todo mundo me chama de “Jesus”. É respeito pela sabedoria ancestral ou pura zoeira?'),
        escolha('PONTO DE DECISÃO 3 — O VEREDITO', [
          { texto: 'É admiração! Só o senhor deixa a aula dupla de terça-feira divertida.', ir: 'apelido_a', efeitos: [rep('gabriel', 5)] },
          { texto: 'Setenta por cento pelo cabelo e pela barba; trinta pelo milagre da nota azul!', ir: 'apelido_b', efeitos: [rep('gabriel', 15), soma('sobrevivencia', 10)] },
          { texto: 'É um título honorário concedido democraticamente pelos estudantes.', ir: 'apelido_c', efeitos: [rep('gabriel', 5)] },
        ])
      ),
      apelido_a: no(fala('gabriel', 'Uma defesa respeitosa! Vou aceitar esse testemunho nos autos.'), ir('fim_audiencia')),
      apelido_b: no(fala('gabriel', 'Olha a diplomacia! Enquanto vocês participarem da aula em vez de dormir na carteira, o apelido está aprovado. Só não esperem multiplicação de pontos sem entregar o trabalho!'), ir('fim_audiencia')),
      apelido_c: no(fala('gabriel', 'Democracia estudantil! Uma decisão legítima — embora eu ainda queira consultar a comissão dos professores.'), ir('fim_audiencia')),
      fim_audiencia: no(
        fala('narrador', 'A bibliotecária avisa discretamente que o horário de estudo acabou. Vocês recolhem o material e saem em direção ao pátio coberto.'),
        fala('gabriel', 'Audiência encerrada! Você foi absolvido de todas as acusações de preguiça acadêmica e nomeado cronista oficial do campus. A História favorece quem não deixa o trabalho para a última hora!'),
        fala('narrador', 'Episódio do Prof. Gabriel concluído! Conquista desbloqueada: Discípulo da História.'),
        fim()
      ),
    },
  },
];

export const CENA_SECRETA = {
  id: 'secreta', professor: 'Os cinco professores', titulo: 'CAFÉ NA SALA DOS PROFESSORES',
  subtitulo: 'Um encontro reservado aos cronistas do campus',
  nos: {
    inicio: no(
      fundo('bg_corredor_professores'),
      fala('narrador', 'Sexta-feira, 17h40. O último dia da semana está chegando ao fim. O corredor administrativo está quase vazio quando você passa pela Sala dos Professores para entregar um formulário. A porta está entreaberta, e vozes familiares ecoam lá dentro.'),
      { cmd: 'sfx', id: 'sfx_caneca' },
      fala('gabriel', 'Eu juro para vocês: na quarta-feira parecia que eu estava presidindo o Congresso de Viena naquela sala de estudo da Biblioteca!'),
      fala('fabiana', 'Pois eu quase perdi três obras completas do Modernismo no corredor ontem. Só não virei uma personagem trágica porque tive reforço!'),
      fala('narrador', 'Você bate levemente à porta. Instantaneamente, cinco pares de olhos se voltam para você — seguidos por sorrisos.'),
      fundo('bg_sala_professores'),
      { cmd: 'musica', id: 'bgm_sala_professores' },
      mostrar('ana_lucia', 'analucia_sorriso_provocador', 'grupo1'),
      mostrar('fabiana', 'fabiana_cafe_feliz', 'grupo2'),
      mostrar('marcos', 'marcos_gala_dramatico', 'grupo3'),
      mostrar('paula', 'paula_energetica_jaleco', 'grupo4'),
      mostrar('gabriel', 'gabriel_sorriso_zoando', 'grupo5'),
      fala('gabriel', 'Olha só quem apareceu! Falando na lenda viva dos corredores! Entra aí, pode deixar o formulário na mesa!'),
      fala('ana_lucia', 'Vejam só: a prova empírica de que um estudante consegue sobreviver aos dilemas da cantina, às pilhas da Fabiana e às perguntas da Paula. Livre-arbítrio ou resistência?'),
      fala('fabiana', 'É pura poesia em movimento! E hoje, milagrosamente, ainda tem café na garrafa!'),
      fala('paula', 'Adaptação evolutiva! Quem interage, participa e não deixa tudo para a última hora se destaca no ecossistema do campus.'),
      fala('marcos', 'Senhoras e senhores, estamos diante do verdadeiro protagonista desta temporada! Da plateia aos bastidores, uma jornada digna de aplausos!'),
      fala('narrador', 'Antes que você responda, a porta se abre. A Diretora Carol aparece com um pote de biscoitos, acompanhada por Fábio e sua inseparável prancheta.'),
      mostrar('carol', 'carol_sorriso_doce', 'grupoExtraEsquerda'),
      mostrar('fabio', 'fabio_sorriso_calmo', 'grupoExtraDireita'),
      fala('carol', 'Ouvi a animação lá do corredor e vim trazer reforços! Peguei biscoitos — e já aproveito para registrar esse encontro histórico para o Instagram do campus!'),
      fala('fabio', 'Pelos registros da CAI desta semana, temos aqui um exemplo de convivência e responsabilidade. Parabéns pelo empenho!'),
      fala('gabriel', 'Pronto! Recebeu a bênção da CAI, biscoito da Diretoria e aprovação de cinco matérias. Já pode pedir transferência direta para o ensino superior!'),
      fala('narrador', 'Todos riem. Por alguns minutos, desaparecem as provas, os prazos, o sinal das 7h15 e o medo dos confiscos. Ficam as pessoas, as histórias e as piadas internas que tornam o IFSP inesquecível.'),
      fala('carol', 'Todo mundo olhando para a câmera! Como a gente legenda essa foto de encerramento da semana?'),
      escolha('ESCOLHA A LEGENDA DA FOTO', [
        { texto: 'Sobrevivemos a mais uma semana no IFSP — com café, ciência, arte e zero advertências!', ir: 'foto_a', efeitos: [soma('sobrevivencia', 30)] },
        { texto: 'Entre Darwin, Drummond, Platão e a CAI: o melhor elenco do campus!', ir: 'foto_b', efeitos: [soma('sobrevivencia', 30)] },
        { texto: 'Sextou no Federal! (E segunda começamos tudo de novo às 07h15!)', ir: 'foto_c', efeitos: [soma('sobrevivencia', 30)] },
      ])
    ),
    foto_a: no(fala('carol', 'Perfeita! Uma síntese muito fiel da nossa semana — e sem nenhuma advertência, por enquanto!'), ir('foto_final')),
    foto_b: no(fala('carol', 'Essa vai direto para a legenda! Um elenco interdisciplinar digno de registro histórico.'), ir('foto_final')),
    foto_c: no(fala('carol', 'A mais realista de todas! Vou publicar antes que alguém se lembre da lista de exercícios de segunda.'), ir('foto_final')),
    foto_final: no(
      { cmd: 'sfx', id: 'sfx_camera' },
      fala('narrador', 'CLICK! A Diretora Carol registra a selfie coletiva. O protagonista aparece ao centro, cercado pelos cinco professores, Carol e Fábio.'),
      fala('narrador', 'Fim de Semana no Campus. Obrigado por jogar Crônicas do IFSP!'),
      { cmd: 'fim_secreto' }
    ),
  },
};
