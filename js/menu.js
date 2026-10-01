/* ==========================================================
   ONG Mãos que Ajudam — Menu de navegação responsivo
   Módulo ES6 sem dependências de outros módulos do projeto.
   Controla a abertura/fechamento do menu "hambúrguer" exibido em
   telas estreitas. O cabeçalho (header/nav) faz parte do "shell"
   fixo da SPA, não é recriado pelo roteador a cada navegação — por
   isso basta inicializar este módulo uma única vez.

   Exporta duas funções: inicializarMenu() (chamada uma vez, por
   main.js, no carregamento da página) e fecharMenuMobile() (chamada
   por router.js a cada troca de rota, para fechar o menu mobile ao
   navegar por um link). Usar export/import aqui, em vez de anexar a
   função a `window`, evita poluir o escopo global e deixa explícito,
   em router.js, de onde fecharMenuMobile() vem.
   ========================================================== */

let botaoMenu = null;
let listaMenu = null;

function alternarMenu(forcarFechado) {
  if (!botaoMenu || !listaMenu) return;
  const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
  const novoEstado = forcarFechado ? false : !aberto;
  botaoMenu.setAttribute("aria-expanded", String(novoEstado));
  listaMenu.classList.toggle("menu-aberto", novoEstado);
}

export function inicializarMenu() {
  botaoMenu = document.querySelector(".menu-hamburguer");
  listaMenu = document.getElementById("menu-lista");

  if (!botaoMenu || !listaMenu) return;

  botaoMenu.addEventListener("click", function () {
    alternarMenu(false);
  });

  /* Fecha o menu ao escolher um link, para não cobrir o conteúdo
     da página seguinte já navegada. */
  listaMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      alternarMenu(true);
    });
  });

  /* Fecha o menu automaticamente se a tela crescer além do
     breakpoint mobile (ex.: usuário girando o tablet). */
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 640) {
      alternarMenu(true);
    }
  });
}

export function fecharMenuMobile() {
  alternarMenu(true);
}
