/* ==========================================================
   ONG Mãos que Ajudam — Alternância manual de tema (claro/escuro)
   Módulo ES6 sem dependências de outros módulos do projeto (folha,
   igual a armazenamento.js e mascaras.js).

   O MODO ESCURO PADRÃO não depende deste arquivo: a folha de estilo
   (css/style.css) já troca sozinha via @media (prefers-color-scheme:
   dark), seguindo a preferência do sistema operacional do usuário sem
   nenhum JavaScript. Este módulo só entra em ação quando o usuário
   pede explicitamente o tema OPOSTO ao do sistema, clicando no botão
   #alternar-tema: aplica o atributo data-tema no <html> (lido pelos
   seletores :root[data-tema="escuro"]/"claro" do CSS, que têm
   prioridade sobre a media query) e grava a escolha no localStorage
   para persistir entre visitas.

   A LEITURA desse valor salvo, na carga seguinte, é feita por um
   pequeno script clássico (não-módulo) embutido direto no <head> do
   index.html — não por este arquivo — porque precisa rodar ANTES da
   primeira pintura da página, o que um módulo ES6 (executado só após
   o documento inteiro ser analisado) não garante; veja o comentário
   junto daquele script para a explicação completa. Este módulo cuida
   só da interação a partir daí: sincronizar o ícone/rótulo do botão
   com o tema já aplicado e alternar o tema a cada clique. */

const CHAVE_TEMA = "maosQueAjudam.tema";

function sistemaPrefereEscuro() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/* O tema "efetivo" é o que está realmente visível na tela: a escolha
   manual (data-tema), se existir, ou a preferência do sistema. */
function temaEfetivo() {
  const escolhaManual = document.documentElement.getAttribute("data-tema");
  if (escolhaManual === "claro" || escolhaManual === "escuro") {
    return escolhaManual;
  }
  return sistemaPrefereEscuro() ? "escuro" : "claro";
}

function atualizarBotao(botao, tema) {
  const ativo = tema === "escuro";
  botao.setAttribute("aria-pressed", String(ativo));
  botao.setAttribute("aria-label", ativo ? "Desativar tema escuro" : "Ativar tema escuro");
  botao.textContent = ativo ? "☀" : "☾";
}

export function inicializarTema() {
  const botao = document.getElementById("alternar-tema");
  if (!botao) return;

  /* Sincroniza o ícone com o que já está em vigor (aplicado pelo script
     do <head> ou, na ausência de escolha salva, pelo sistema operacional
     via CSS) — sem isso, o botão abriria sempre mostrando "Ativar tema
     escuro", mesmo quando o escuro já estivesse ativo. */
  atualizarBotao(botao, temaEfetivo());

  botao.addEventListener("click", function () {
    const novoTema = temaEfetivo() === "escuro" ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", novoTema);
    atualizarBotao(botao, novoTema);

    try {
      localStorage.setItem(CHAVE_TEMA, novoTema);
    } catch (erro) {
      /* Navegação privada, armazenamento bloqueado ou cota excedida: a
         alternância ainda funciona normalmente durante esta sessão, só
         não é lembrada na próxima visita. */
    }
  });
}
