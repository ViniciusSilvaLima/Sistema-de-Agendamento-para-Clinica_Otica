# Sistema-de-Agendamento-para-Clinica_Otica
#Documentação do Projeto: Sistema de Agendamento de Consultas
Visão Geral
O sistema de agendamento de consultas foi desenvolvido para gerenciar os horários de atendimento de uma clínica ótica. Ele permite que os usuários marquem consultas em horários disponíveis e que os administradores visualizem e gerenciem os agendamentos.

Funcionalidades
Para Usuários:
Login: Acesso ao sistema com usuário e senha.

Agendamento: Marcação de consultas em horários disponíveis.

Visualização de Horários: Exibição dos horários disponíveis com base no dia selecionado.

Para Administradores:
Visualização de Agendamentos: Lista de todas as consultas agendadas.

Alteração de Status: Mudança do status das consultas (Agendado, Concluído, Cancelado).

Liberação de Horários: Horários são liberados automaticamente quando uma consulta é marcada como "Concluída" ou "Cancelada".

Regras de Negócio
Horário de Funcionamento:

Segunda a Sexta: 07:00 às 17:00.

Sábado: 09:00 às 14:00.

Domingo: Fechado.

Feriados: Fechado.

Feriados:

Feriados nacionais e de São Paulo são considerados.

Feriados móveis (Carnaval, Sexta-Feira Santa, Corpus Christi) são calculados com base na data da Páscoa.

Agendamentos:

Os horários são bloqueados após serem agendados.

Horários são liberados quando uma consulta é concluída ou cancelada.

Tecnologias Utilizadas
HTML: Estrutura da interface do usuário.

CSS: Estilização da interface.

JavaScript: Lógica do sistema, validações e interações dinâmicas.

LocalStorage: Armazenamento dos agendamentos no navegador.

Estrutura do Projeto
Arquivos:
index.html: Página de login.

usuario.html: Página de agendamento para usuários.

admin.html: Página de gerenciamento para administradores.

styles.css: Estilos CSS para a interface.

script.js: Lógica JavaScript do sistema.

Fluxo do Sistema:
O usuário faz login.

Se for um usuário comum, é redirecionado para a página de agendamento.

Se for um administrador, é redirecionado para a página de gerenciamento.

Na página de agendamento, o usuário seleciona uma data e um horário disponível.

Na página de gerenciamento, o administrador visualiza e altera o status das consultas.

Detalhes Técnicos
Funções Principais:
calcularPascoa(ano):

Calcula a data da Páscoa para um determinado ano usando o algoritmo de Gauss.

getFeriados(ano):

Retorna uma lista de feriados (fixos e móveis) para o ano especificado.

gerarHorarios(data):

Gera os horários disponíveis com base no dia da semana e no horário de funcionamento da clínica.

isFeriado(data):

Verifica se uma data é um feriado.

gerarCalendario():

Gera um calendário dinâmico, colorindo os dias abertos (verde) e fechados (vermelho).

atualizarHorarios():

Atualiza os horários disponíveis com base na data selecionada.

atualizarListaConsultas():

Atualiza a lista de consultas na página do administrador.

Como Usar
Passo a Passo:
Login:

Acesse a página de login.

Use user como usuário e user como senha para acessar a página de agendamento.

Use admin como usuário e admin como senha para acessar a página de gerenciamento.

Agendamento:

Na página de agendamento, selecione uma data.

Escolha um horário disponível e preencha o formulário.

Clique em "Agendar" para confirmar.

Gerenciamento:

Na página de gerenciamento, visualize todas as consultas agendadas.

Altere o status das consultas (Agendado, Concluído, Cancelado).

Exemplos de Código
Cálculo da Páscoa:
function calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
}

Geração de Horários:
function gerarHorarios(data) {
    const diaSemana = new Date(data).getDay();
    const horarios = [];

    if (diaSemana === 6) {
        for (let hora = 9; hora <= 14; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                if (hora === 14 && minuto === 30) break;
                const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
                horarios.push(horario);
            }
        }
    } else if (diaSemana >= 1 && diaSemana <= 5) {
        for (let hora = 7; hora <= 17; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
                const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
                horarios.push(horario);
            }
        }
    }
    return horarios;
}
Considerações Finais
Este sistema é um protótipo funcional para gerenciar agendamentos em uma clínica ótica. Ele pode ser expandido com funcionalidades adicionais, como:

Integração com um banco de dados.

Envio de lembretes por e-mail ou SMS.

Interface mais robusta e responsiva.
